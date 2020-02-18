import SgEnum from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/interfaces/sgEnum';

enum RF {
  RF_INVALID,
  RF_LIQUID,
  RF_SOLID
}

class ResourceForm extends SgEnum<RF> {
  constructor(str: string) {
    super(RF, str);
  }

  static from(o: string): ResourceForm {
    const retrievedValue = possibleEnums.get(o);
    if (retrievedValue === undefined) {
      console.error('ResourceForm requires new enum:', o);
    }

    return retrievedValue ?? ResourceForm.from('RF_SOLID');
  }

  static to(o: ResourceForm): string {
    return RF[o.value];
  }

  public getAllEnums(callback: Function) {
    return getAllLocalEnums(callback);
  }
}

const possibleEnums: Map<string, ResourceForm> = new Map();

const getAllLocalEnums = (callback: Function) => {
  for (let rfKey in RF) {
    if (isNaN(parseInt(rfKey))) {
      callback(rfKey);
    }
  }
};

getAllLocalEnums((rfKey: string) =>
  possibleEnums.set(rfKey, new ResourceForm(rfKey))
);

export const RF_EMPTY = ResourceForm.from('RF_INVALID');

export default ResourceForm;
