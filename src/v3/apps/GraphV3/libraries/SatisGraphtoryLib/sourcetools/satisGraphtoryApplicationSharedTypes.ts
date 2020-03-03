import ExtractorMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/extractorMachine';
import BeltAttachmentMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/beltAttachmentMachine';
import FluidStorageMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/fluidStorageMachine';
import ManufacturerMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/manufacturerMachine';
import SolidStorageMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/solidStorageMachine';
import Belt from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/belt';

export const satisGraphtoryApplicationNodeTypes = [
  ExtractorMachine,
  BeltAttachmentMachine,
  FluidStorageMachine,
  ManufacturerMachine,
  SolidStorageMachine
];

export const satisGraphtoryApplicationEdgeTypes = [Belt];

const satisGraphtoryApplicationSharedTypes = {
  nodes: satisGraphtoryApplicationNodeTypes,
  edges: satisGraphtoryApplicationEdgeTypes
};

export default satisGraphtoryApplicationSharedTypes;
