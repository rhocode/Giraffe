import { BuilderFactoryFirebase } from '../utils/BuilderFactory';
import FirebaseDataType from './internal/FirebaseDataType';

export default class Item extends FirebaseDataType {
  iconPath: any;
  // testNumber: any;
  // testMultiple: any;
  identifierAsDocumentName: boolean = true;

  static fromFirebase(firebaseRef: any): Item {
    return BuilderFactoryFirebase<Item>(firebaseRef, Item);
  }

  gsheetId: number = 2;

  import(objectPath: any) {
    const keys = ['identifier'];
    const parseFunctions = {
      identifier: (a: string): string => {
        const parts: any = a.split(' x ');
        if (parts.length > 0) {
          return parts[0].replace(/ /g, '_').toLowerCase();
        }
        return '';
      }
    };
    const promiseList: any = [];
    this.grabPageData().then((data: any) => {
      data.forEach((item: any) => {

        const data = this.unpackDataFromSpreadSheet(keys, item, parseFunctions);
        data.iconPath = data.identifier + '.png';
        console.error(data.identifier);
        promiseList.push(this.writeNewPojo(data, objectPath));
        return 1;
      });
    });
    Promise.all(promiseList).then(() => {
      console.error("All done!");
    })
  }

  dataMapping() {
    return {
      iconPath: { type: 'string' }
      // testNumber: {type: 'number'},
      // testMultiple: [{identifier: 'a', type: 'number'}, {identifier: 'b', type: 'number'}]
    };
  }

  saveProto(docs: any, protoRoot: any): any {
    const Item = protoRoot.lookupType("Item");
    const ItemList = protoRoot.lookupType("ItemList");
    const itemsList: any[] = [];
    docs.forEach((d: any) => {
      const docItem = Item.create({
        id: d.identifier,
        icon: d.iconPath,
        hidden: false
      });

      itemsList.push(docItem)
    });

    const message = ItemList.create({data: itemsList});
    const buffer = ItemList.encode(message).finish();
    const filename = "ItemList.s2";

    return {
      table: buffer,
      filename
    };
  }
}
