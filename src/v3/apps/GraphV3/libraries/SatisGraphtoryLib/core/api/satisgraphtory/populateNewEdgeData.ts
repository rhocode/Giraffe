import uuidGen from 'v3/utils/stringUtils';
import SimpleEdge from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/SimpleEdge';
import { getItemResourceForm } from 'v3/data/loaders/items';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { EdgeAttachmentSide } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeAttachmentSide';

const populateNewEdgeData = (
  items: string[] | null,
  resourceForm: number | null,
  connectorName: string,
  sourceNode: NodeTemplate,
  targetNode: NodeTemplate,
  sourceNodeAttachmentSide?: EdgeAttachmentSide,
  targetNodeAttachmentSide?: EdgeAttachmentSide
) => {
  if (items === null && resourceForm == null) {
    throw new Error('Only recipe or resourceForm can be null, not both');
  }

  let usedResourceForm = resourceForm;

  if (items !== null && items.length > 0) {
    const allResourceForms = items.map((item) => getItemResourceForm(item));
    if (new Set(allResourceForms).size > 1) {
      throw new Error('Multiple resource forms not allowed here');
    }
    usedResourceForm = allResourceForms[0];
  }

  if (usedResourceForm === null) {
    throw new Error('ResourceForm is still null');
  }

  return new SimpleEdge({
    id: uuidGen(),
    resourceForm: usedResourceForm as number,
    sourceNode,
    targetNode,
    connectorName,
    sourceNodeAttachmentSide,
    targetNodeAttachmentSide,
    useProvidedAttachmentSides: true,
    externalInteractionManager: sourceNode.getInteractionManager(), // TODO: a hack to pass through the theme
  });
};

export default populateNewEdgeData;
