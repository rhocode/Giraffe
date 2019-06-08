import { BuilderFactoryFirebase } from '../utils/BuilderFactory';
import FirebaseDataType from './internal/FirebaseDataType';

export default class UpgradeTier extends FirebaseDataType {
  identifier: any;

  identifierAsDocumentName: boolean = true;

  static fromFirebase(firebaseRef: any): UpgradeTier {
    return BuilderFactoryFirebase<UpgradeTier>(firebaseRef, UpgradeTier);
  }

  import() {}

  dataMapping() {
    return {
      identifier: { type: 'string' }
    };
  }
}
