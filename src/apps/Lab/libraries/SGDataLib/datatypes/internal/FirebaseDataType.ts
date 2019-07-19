import firebase from 'firebase/app';
import 'firebase/firestore';

import {traverseDocPath} from '../../utils/BuilderFactory';
import firebaseFirestore from '../../../../../../common/firebase/firebaseFirestore';
import schemas from "../../../../../../generated";

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


function saveAs(blob: any, fileName: any) {
  const url = window.URL.createObjectURL(blob);

  const anchorElem = document.createElement("a");
  // anchorElem.style = "display: none";
  anchorElem.href = url;
  anchorElem.download = fileName;

  document.body.appendChild(anchorElem);
  anchorElem.click();
  document.body.removeChild(anchorElem);

  // On Edge, revokeObjectURL should be called only after
  // a.click() has completed, atleast on EdgeHTML 15.15048
  setTimeout(function () {
    window.URL.revokeObjectURL(url);
  }, 1000);
}


export default abstract class FirebaseDataType {
  identifierAsDocumentName: boolean = false;
  gsheetId: number = -1;
  private __sglib__firebaseId: string = '';
  private __sglib__firebaseRef: any = null;
  private __sglib__firebaseRefPath: any = null;
  private __sglib__addedFields: any = new Set();
  private __sglib__complexEntryRowCountByField: any = {};

  abstract dataMapping(): any;

  public abstract saveProto(docs: any, protoRoot: any): any;

  public downloadDataToProto(path: any): any {
    const protobuf = require("protobufjs/light");
    console.error(schemas, "AAAA");
    const root = protobuf.Root.fromJSON((schemas as any)["0.1.0"]);
    const table = traverseDocPath(path, firebaseFirestore);

    table.get().then((querySnapshot: any) => {

      const totalQuery: any = [];

      querySnapshot.forEach((doc: any) => {
        totalQuery.push(doc.data());
      });

      const {table, filename} = this.saveProto(totalQuery, root);
      const blob = new Blob([table], {type: "application/octet-stream"});
      saveAs(blob, filename);

      const ItemList = root.lookupType("ItemList");

      // new Response(blob).arrayBuffer().then(buffer => new Uint8Array(buffer)).then((buffer: any) => {
      //   const message = ItemList.decode(buffer);
      //   console.error(message);
      // })
      //
      fetch("/proto/0.1.0/ItemList.s2").then(resp => resp.blob()).then(blob => new Response(blob).arrayBuffer()).then(buffer => new Uint8Array(buffer)).then((buffer: any) => {
        const message = ItemList.decode(buffer);
        console.error(message);
      })
    });
  }

  unpackDataFromSpreadSheet(keys: any, data: any, parseFunctions: any, keyAlternateName: any = {}): any {
    const prefix = 'gsx$';
    const dict: any = {};
    keys.forEach((key: any) => {
      const func =
        parseFunctions[key] ||
        function (a: any) {
          return a;
        };
      if (keyAlternateName[key]) {
        const keyName = keyAlternateName[key];
        dict[keyName] = func(data[prefix + key]['$t']);
        if (dict[keyName] === '') {
          delete dict[keyName];
        }
      } else {
        dict[key] = func(data[prefix + key]['$t']);
        if (dict[key] === '') {
          delete dict[key];
        }
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

  importSibling(objectPath: any, siblingName: any): Promise<any> {
    const newPathPartial: any = objectPath.split('/');

    const newPath = newPathPartial.slice(0, newPathPartial.length - 1);
    newPath.push(siblingName);
    const table = traverseDocPath(newPath.join('/'), firebaseFirestore);

    return table.get().then(function (querySnapshot: any) {

      const totalQuery: any = [];

      querySnapshot.forEach(function (doc: any) {
        totalQuery.push(doc.data());
      });

      return totalQuery;
    });
  }

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
              const {identifier, type, ref} = descriptor;
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
              generatedDataMap[obfuscatedName] = {type, ref};
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
    console.error(path);
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

      return docRef.get().then(function (doc: any) {
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

      let result = null;

      try {
        result = docRef
          .set(
            Object.assign({}, initialPojo, {
              [hiddenFieldPrefix +
              'timestamp']: firebase.firestore.Timestamp.now()
            })
          )
          .then(() => {
            return Promise.resolve();
          });
      } catch (e) {
        console.error(e);
        console.error("!!!!!", JSON.stringify(initialPojo));
      }


      return result
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
          if (resultantPojso[key] === 'false') {
            resultantPojso[key] = false
          } else if (resultantPojso[key] === 'true') {
            resultantPojso[key] = true
          }
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
    let result = null;

    try {
      result = this.__sglib__firebaseRef
        .set(pojso)
        .then(() => this.clean())
        .catch((err: any) => {
          console.error(err);
        });

    } catch (e) {
      console.error(e);
      console.error("!!!!!", pojso);
    }

    return result
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
