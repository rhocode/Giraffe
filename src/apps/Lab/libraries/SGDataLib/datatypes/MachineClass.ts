import { BuilderFactoryFirebase } from '../utils/BuilderFactory';
import FirebaseDataType from './internal/FirebaseDataType';

const cleanDeep = require('clean-deep');

export default class MachineClass extends FirebaseDataType {
  identifier: any;
  upgradeLevels: any;

  identifierAsDocumentName: boolean = true;
  gsheetId: number = 3;

  static fromFirebase(firebaseRef: any): MachineClass {
    return BuilderFactoryFirebase<MachineClass>(firebaseRef, MachineClass);
  }

  import(objectPath: any) {
    const keys = [
      'identifier',
      'upgradelevel1',
      'upgradelevel2',
      'upgradelevel3',
      'upgradelevel4',
      'upgradelevel5',
      'upgradelevel6',
      'powerlevel1',
      'powerlevel2',
      'powerlevel3',
      'inputslots',
      'outputslots'
    ];
    const parseFunctions = {
      identifier: (a: string): string => {
        const parts: any = a.split(' x ');
        if (parts.length > 0) {
          return parts[0].replace(/ /g, '_').toLowerCase();
        }
        return '';
      }
    };
    this.grabPageData().then((data: any) => {
      data.forEach((item: any) => {
        const data = this.unpackDataFromSpreadSheet(keys, item, parseFunctions);
        const newPojo = {
          identifier: data.identifier,
          inputs: data.inputslots,
          outputs: data.outputslots,
          upgradeLevels: [
            { upgradeTier: data.upgradelevel1 },
            { upgradeTier: data.upgradelevel2 },
            { upgradeTier: data.upgradelevel3 },
            { upgradeTier: data.upgradelevel4 },
            { upgradeTier: data.upgradelevel5 },
            { upgradeTier: data.upgradelevel6 }
          ].filter((item: any) => item && item.upgradeTier),
          powerLevel: [
            { tier: data.upgradelevel1, power: data.powerlevel1 },
            { tier: data.upgradelevel2, power: data.powerlevel2 },
            { tier: data.upgradelevel3, power: data.powerlevel3 }
          ].filter((item: any) => item && item.tier && item.power)
        };

        this.writeNewPojo(cleanDeep(newPojo), objectPath);
        return 1;
      });
    });
  }

  // https://docs.google.com/spreadsheets/d/1QTdoUFIJ3GQFodgaDkrj2wbkl151EIwym99Wm3xFLOQ/edit#gid=0
  dataMapping() {
    return {
      identifier: { type: 'string' },
      upgradeLevels: [
        { identifier: 'upgradeTier', type: 'string', ref: 'UpgradeTier' }
      ],
      powerLevel: [
        { identifier: 'tier', type: 'string', ref: 'UpgradeTier' },
        { identifier: 'power', type: 'number' }
      ]
    };
  }

  saveProto(docs: any, protoRoot: any): any {
    console.log(JSON.stringify(docs));
  }
}
