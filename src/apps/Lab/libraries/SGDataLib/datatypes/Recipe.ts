import {BuilderFactoryFirebase} from '../utils/BuilderFactory';
import FirebaseDataType from './internal/FirebaseDataType';

export default class Recipe extends FirebaseDataType {
  name: any;
  outputItemId: any;
  outputItemQuantity: any;
  inputItems: any;
  machineClass: any;

  identifierAsDocumentName: boolean = false;
  gsheetId: number = 4;

  static fromFirebase(firebaseRef: any): Recipe {
    return BuilderFactoryFirebase<Recipe>(firebaseRef, Recipe);
  }

  import(objectPath: any) {
    const keys = [
      'machinename',
      'displayname',
      'recipename',
      'produces',
      'unitsproduced',
      'resource1',
      'perbatch1',
      'resource2',
      'perbatch2',
      'resource3',
      'perbatch3',
      'resource4',
      'perbatch4'
    ];
    const nameParse = (a: string): string => {
      if (a.length === 0) {
        return '';
      }
      return a.replace(/ /g, '_').toLowerCase();
    };
    this.grabPageData().then((data: any) => {
      this.importSibling(objectPath, 'MachineClass').then(machines => {
        this.importSibling(objectPath, 'Item').then(items => {
          const parseFunctions = {
            machinename: nameParse,
            produces: nameParse,
            recipename: nameParse,
            displayname: nameParse,
            resource1: nameParse,
            resource2: nameParse,
            resource3: nameParse,
            resource4: nameParse
          };

          const machineNames = machines.map((m: any) => m.identifier);
          const itemNames = items.map((i: any) => i.identifier);

          data.forEach((item: any) => {
            const data = this.unpackDataFromSpreadSheet(
              keys,
              item,
              parseFunctions
            );
            if (machineNames.indexOf(data.machinename) === -1) {
              throw new Error('No machine name ' + data.machinename);
            }

            if (data.produces && itemNames.indexOf(data.produces) === -1) {
              throw new Error('No item name ' + data.produces);
            }

            if (data.resource1 && itemNames.indexOf(data.resource1) === -1) {
              throw new Error('No item name ' + data.resource1);
            }

            if (data.resource2 && itemNames.indexOf(data.resource2) === -1) {
              throw new Error('No item name ' + data.resource2);
            }

            if (data.resource3 && itemNames.indexOf(data.resource3) === -1) {
              throw new Error('No item name ' + data.resource3);
            }

            if (data.resource4 && itemNames.indexOf(data.resource4) === -1) {
              throw new Error('No item name ' + data.resource4);
            }

            const newPojo: any = {
              name: data.recipename,
              alternateName: data.displayname ? data.displayname : null,
              isAltRecipe: !!data.displayname,
              machineClass: data.machinename,
              outputItemId: data.produces,
              outputItemQuantity: data.unitsproduced,
              input: [
                {itemId: data.resource1, itemQty: data.perbatch1},
                {itemId: data.resource2, itemQty: data.perbatch2},
                {itemId: data.resource3, itemQty: data.perbatch3},
                {itemId: data.resource4, itemQty: data.perbatch4}
              ].filter((item: any) => item && item.itemId)
            };
            // if (newPojo.name === "hazmat_filter" ) {
            //   console.log(newPojo, data);
            // }
            this.writeNewPojo(newPojo, objectPath);
            return 1;
          });
          console.log('FINISHED');
        });
      });
    });
  }


  dataMapping() {
    return {
      name: {type: 'string'},
      outputItemId: {type: 'string', ref: 'Item'},
      outputItemQuantity: {type: 'number'},
      alternateName: {type: 'string'},
      isAltRecipe: {type: 'boolean'},
      machineClass: {type: 'string', ref: 'MachineClass'},
      input: [
        {identifier: 'itemId', type: 'string', ref: 'Item'},
        {identifier: 'itemQty', type: 'number'}
      ]
    };
  }


  saveProto(docs: any, protoRoot: any): any {
    console.log(JSON.stringify(docs));
  }
}
