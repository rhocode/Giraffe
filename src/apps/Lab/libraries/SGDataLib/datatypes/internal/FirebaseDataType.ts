import firebase from 'firebase/app';
import 'firebase/firestore';

import { traverseDocPath } from '../../utils/BuilderFactory';
import firebaseFirestore from '../../../../../../common/firebase/firebaseFirestore';

const hiddenFieldPrefix = '__sglib__';
const complexArrayFieldPrefix = '__sglibarrcomplex__';
const secretDelimiter = '__^&^__';
const cleanDeep = require('clean-deep');

export function unpackComplexObject(key: string) {
  return key.replace(complexArrayFieldPrefix, '').split(secretDelimiter);
}

export function repackComplexObject(items: string[]) {
  return complexArrayFieldPrefix + items.join(secretDelimiter);
}

export function padIndex(i: number) {
  return (i + '').padStart(10, '0');
}

export default abstract class FirebaseDataType {
  identifierAsDocumentName: boolean = false;
  private __sglib__firebaseId: string = '';
  private __sglib__firebaseRef: any = null;
  private __sglib__firebaseRefPath: any = null;
  private __sglib__addedFields: any = new Set();
  private __sglib__complexEntryRowCountByField: any = {};

  abstract dataMapping(): any;

  gsheetId: number = -1;

  unpackDataFromSpreadSheet(keys: any, data: any, parseFunctions: any): any {
    const prefix = 'gsx$';
    const dict: any = {};
    keys.forEach((key: any) => {
      const func =
        parseFunctions[key] ||
        function(a: any) {
          return a;
        };
      dict[key] = func(data[prefix + key]['$t']);
      if (dict[key] === '') {
        delete dict[key];
      }
    });

    return dict;
  }

  grabPageData(): any {
    const url =
      'https://spreadsheets.google.com/feeds/list/1QTdoUFIJ3GQFodgaDkrj2wbkl151EIwym99Wm3xFLOQ/' +
      this.gsheetId +
      '/public/values?alt=json';

    return fetch(url)
      .then(response => response.json())
      .then(json => json.feed.entry);
  }

  abstract import(objectPath: any): any;

  useIdentifierAsDocumentName(): boolean {
    return this.identifierAsDocumentName;
  }

  generatedDataMapping(localChanges: any = {}) {
    const generatedDataMap: any = {};
    const map = this.dataMapping();

    Object.keys(this.dataMapping()).forEach(item => {
      if (Array.isArray(map[item])) {
        this.__sglib__addedFields.add(item);
        if (map[item].length >= 1) {
          // const thisData = (this as any)[item];
          let numEntries = 0;

          if (((this as any)[item] || []).length) {
            numEntries = ((this as any)[item] || []).length + 1;
          } else {
            numEntries = 1;
          }

          if (localChanges[item]) {
            numEntries = localChanges[item];
          }

          this.__sglib__complexEntryRowCountByField[item] = numEntries;

          for (let i = 0; i < numEntries; i++) {
            map[item].forEach((descriptor: any) => {
              const { identifier, type, ref } = descriptor;
              // this.__sglib__addedFieldsMetadata[item] = this.__sglib__addedFieldsMetadata[item] || {};
              // this.__sglib__addedFieldsMetadata[item].fields = this.__sglib__addedFieldsMetadata[item].fields || new Set();
              // this.__sglib__addedFieldsMetadata[item].fields.add(identifier);
              //
              // this.__sglib__addedFieldsMetadata[item].fields = this.__sglib__addedFieldsMetadata[item].fields || new Set();
              // this.__sglib__addedFieldsMetadata[item].fields.add(identifier);

              const paddedIndex = padIndex(i);

              const obfuscatedName =
                complexArrayFieldPrefix +
                item +
                secretDelimiter +
                paddedIndex +
                secretDelimiter +
                identifier;
              generatedDataMap[obfuscatedName] = { type, ref };
              if (((this as any)[item] || []).length === 0) {
                // create blanks?
              } else {
                if (
                  (this as any)[item] &&
                  (this as any)[item][i] &&
                  (this as any)[item][i][identifier]
                ) {
                  (this as any)[obfuscatedName] = (this as any)[item][i][
                    identifier
                  ];
                }
              }
            });
          }
        } else {
        }
      } else if (typeof map[item] == 'object') {
        generatedDataMap[item] = map[item];
      }
    });
    return generatedDataMap;
  }

  getEntriesByField(field: any) {
    return this.__sglib__complexEntryRowCountByField[field] || 1;
  }

  generatedDataMappingNormalKeys() {
    const allKeys = Object.keys(this.generatedDataMapping());
    return allKeys.filter(key => !key.startsWith(complexArrayFieldPrefix));
  }

  generatedDataMappingComplexKeys(localChanges: any = {}) {
    const allKeys = Object.keys(this.generatedDataMapping(localChanges));
    const secondKeys = allKeys.filter(key =>
      key.startsWith(complexArrayFieldPrefix)
    );
    secondKeys.sort();

    return secondKeys;
  }

  public writeNewPojo(pojo: any, path: any) {
    const cloneObj = Object.create(this);
    if (this.identifierAsDocumentName) {
      // use the field identifier
      cloneObj.initialize(path, firebaseFirestore, pojo.identifier, true, pojo);
    } else {
      cloneObj.initialize(path, firebaseFirestore, null, true, pojo);
    }
  }

  public initialize(
    path: string,
    firestore: any,
    name: string,
    overwrite: boolean = false,
    initialPojo = {}
  ): any {
    const table = traverseDocPath(path, firestore);

    if (name) {
      const docRef = table.doc(name);

      this.__sglib__firebaseRef = docRef;
      this.__sglib__firebaseRefPath = path + '/' + name;

      return docRef.get().then(function(doc: any) {
        if (doc.exists && !overwrite) {
          return Promise.reject(`Entry with name ${name} already exists!`);
        } else {
          return docRef
            .set(
              Object.assign({}, initialPojo, {
                [hiddenFieldPrefix +
                'timestamp']: firebase.firestore.Timestamp.now()
              })
            )
            .then(() => {
              return Promise.resolve();
            });
        }
      });
    } else {
      const docRef = table.doc();

      this.__sglib__firebaseRef = docRef;
      this.__sglib__firebaseRefPath = path + '/' + docRef.id;

      return docRef
        .set(
          Object.assign({}, initialPojo, {
            [hiddenFieldPrefix +
            'timestamp']: firebase.firestore.Timestamp.now()
          })
        )
        .then(() => {
          return Promise.resolve();
        });
    }
  }

  public getData(): any {
    const resultantPojso: any = {};
    const keysToProcess = Object.keys(this)
      .filter((item: string) => !item.startsWith(hiddenFieldPrefix))
      .filter(
        (item: string) =>
          !['identifierAsDocumentName', 'gsheedId'].includes(item)
      )
      .sort();
    keysToProcess.forEach((key: string) => {
      if (key.startsWith(complexArrayFieldPrefix)) {
        const [fieldName, rowString, keyName] = unpackComplexObject(key);

        const row = parseInt(rowString);

        resultantPojso[fieldName] = resultantPojso[fieldName] || [];
        while (row >= resultantPojso[fieldName].length) {
          resultantPojso[fieldName].push({});
        }

        resultantPojso[fieldName][row][keyName] = (this as any)[key] || null;
      } else {
        if (!this.__sglib__addedFields.has(key)) {
          resultantPojso[key] = (this as any)[key] || null;
        }
      }
    });

    return resultantPojso;
  }

  public getServerValue(dataKey: any): any {
    return (this as any)[dataKey];
  }

  public write(): any {
    const documentData = this.getData();

    documentData[
      hiddenFieldPrefix + 'timestamp'
    ] = firebase.firestore.Timestamp.now();
    const pojso = cleanDeep(documentData);
    return this.__sglib__firebaseRef
      .set(pojso)
      .then(() => this.clean())
      .catch((err: any) => {
        console.error(err);
      });
  }

  public delete(): any {
    return this.__sglib__firebaseRef.delete();
  }

  public isLocalEntry(): boolean {
    return !this.__sglib__firebaseRefPath;
  }

  public getFirebaseId(): string {
    return this.__sglib__firebaseId;
  }

  public getFirebaseRefPath(): any {
    return this.__sglib__firebaseRefPath;
  }

  private clean(): void {
    Array.from(this.__sglib__addedFields).forEach((field: any) => {
      delete (this as any)[field];
    });
  }
}
