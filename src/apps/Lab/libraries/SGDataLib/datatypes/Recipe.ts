import { BuilderFactoryFirebase } from '../utils/BuilderFactory';
import FirebaseDataType from './internal/FirebaseDataType';

export default class Recipe extends FirebaseDataType {
  name: any;
  outputItemId: any;
  outputItemQuantity: any;
  inputItems: any;
  machineClass: any;

  identifierAsDocumentName: boolean = false;

  static fromFirebase(firebaseRef: any): Recipe {
    return BuilderFactoryFirebase<Recipe>(firebaseRef, Recipe);
  }

  import() {}

  dataMapping() {
    return {
      name: { type: 'string' },
      outputItemId: { type: 'string', ref: 'Item' },
      outputItemQuantity: { type: 'number' },
      machineClass: { type: 'string', ref: 'MachineClass' },
      input: [
        { identifier: 'itemId', type: 'string', ref: 'Item' },
        { identifier: 'itemQty', type: 'number' }
      ]
    };
  }
}
