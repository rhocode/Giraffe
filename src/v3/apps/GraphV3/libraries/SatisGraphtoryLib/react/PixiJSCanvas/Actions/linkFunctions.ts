import { GraphObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import {
  addObjectChildren,
  getChildFromStateById,
  getMultiTypedChildrenFromState,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas/childrenApi';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { EmptyEdge } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EmptyEdge';
import { EResourceForm } from '.data-landing/interfaces/enums';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { getSupportedResourceForm } from 'v3/data/loaders/buildings';
import uuidGen from 'v3/utils/stringUtils';
import SimpleEdge from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/SimpleEdge';

export const setHighLightInStateChildren = (
  state: any,
  types: GraphObject[],
  highlightOn: boolean
) => {
  for (const child of getMultiTypedChildrenFromState(state, types)) {
    child.container.setHighLightOn(highlightOn);
  }
};

export const hasEmptyEdgesWithSelectedResource = (
  edges: EdgeTemplate[],
  supportedResourceForms: Set<EResourceForm>
) => {
  let found = false;

  for (const edge of edges) {
    if (edge instanceof EmptyEdge) {
      if (supportedResourceForms.has(edge.resourceForm)) {
        found = true;
        break;
      }
    }
  }

  return found;
};

export const resetState = () => () => {};

export const onCancelLink = (
  pixiCanvasStateId: string,
  eventEmitter: any,
  supportedResourceForms: Set<EResourceForm>,
  selectedEdge: any
) => () => {
  pixiJsStore.update([
    resetNodes(pixiCanvasStateId),
    setUpLinkInitialState(
      eventEmitter,
      pixiCanvasStateId,
      supportedResourceForms,
      selectedEdge
    ),
  ]);
};

export const resetNodes = (pixiCanvasStateId: string) => (sParent: any) => {
  const s = sParent[pixiCanvasStateId];

  for (const child of getMultiTypedChildrenFromState(s, [
    EdgeTemplate,
    NodeTemplate,
  ])) {
    child.container.setHighLightOn(false);
    child.container.alpha = 1;
    child.removeInteractionEvents();
  }
};

export const onStartLink = (pixiCanvasStateId: string, selectedEdge: any) => (
  startLinkId: string
) => {
  pixiJsStore.update((sParent) => {
    const s = sParent[pixiCanvasStateId];

    const types = ([EdgeTemplate, NodeTemplate] as unknown) as GraphObject[];

    setHighLightInStateChildren(s, types, false);

    const retrievedNode = getChildFromStateById(s, startLinkId);

    if (retrievedNode instanceof NodeTemplate) {
      retrievedNode.container.setHighLightOn(true);
    }

    const supportedResourceForms = new Set(
      getSupportedResourceForm(selectedEdge)
    );

    let hasOutputAvailable = hasEmptyEdgesWithSelectedResource(
      [...retrievedNode.outputConnections, ...retrievedNode.anyConnections],
      supportedResourceForms
    );

    if (hasOutputAvailable) {
      console.log('HAS');
      // Business as as normal
      for (const child of getMultiTypedChildrenFromState(s, [NodeTemplate])) {
        if (child.id === startLinkId) continue;

        let found = hasEmptyEdgesWithSelectedResource(
          [...child.inputConnections, ...child.anyConnections],
          supportedResourceForms
        );

        child.container.alpha = 1;

        if (!found) {
          child.removeInteractionEvents();
          child.container.alpha = 0.2;
        }
      }
    } else {
      console.log('NO HAS');
      // Disable interaction for all other nodes, just so you can't actually click anything.
      for (const child of getMultiTypedChildrenFromState(s, [NodeTemplate])) {
        if (child.id === startLinkId) continue;

        child.removeInteractionEvents();
        child.container.alpha = 0.2;
      }
    }

    s.sourceNodeId = startLinkId;
  });
};

export const onEndLink = (
  pixiCanvasStateId: string,
  eventEmitter: any,
  supportedResourceForms: Set<EResourceForm>,
  selectedEdge: any
) => (endLinkId: string) => {
  pixiJsStore.update([
    (sParent) => {
      const s = sParent[pixiCanvasStateId];

      let sourceNode, targetNode;

      for (const child of getMultiTypedChildrenFromState(s, [
        EdgeTemplate,
        NodeTemplate,
      ])) {
        child.container.setHighLightOn(false);
        if (child.id === s.sourceNodeId) {
          sourceNode = child;
        }

        if (child.id === endLinkId) {
          targetNode = child;
        }
      }

      if (!targetNode || !sourceNode) {
        throw new Error('source or target not found');
      }

      const possibleResourceForms = getSupportedResourceForm(selectedEdge);

      //TODO: Fix this resource form resolution, maybe from the interface?

      const edgeProps = {
        id: uuidGen(),
        resourceForm: possibleResourceForms[0],
        sourceNode,
        targetNode,
      };

      const edge = new SimpleEdge(edgeProps);

      addObjectChildren([edge], pixiCanvasStateId, true);
    },
    resetNodes(pixiCanvasStateId),
    setUpLinkInitialState(
      eventEmitter,
      pixiCanvasStateId,
      supportedResourceForms,
      selectedEdge
    ),
  ]);
};

export const setUpLinkInitialState = (
  eventEmitter: any,
  pixiCanvasStateId: string,
  supportedResourceForms: Set<EResourceForm>,
  selectedEdge: any
) => (t: any) => {
  const s = t[pixiCanvasStateId];
  for (const child of getMultiTypedChildrenFromState(s, [NodeTemplate])) {
    if (child instanceof NodeTemplate) {
      let selected = hasEmptyEdgesWithSelectedResource(
        [...child.outputConnections, ...child.anyConnections],
        supportedResourceForms
      );

      if (selected) {
        child.container.alpha = 1;
        child.attachEventEmitter(eventEmitter);
        child.addLinkEvents(
          onStartLink(pixiCanvasStateId, selectedEdge),
          onEndLink(
            pixiCanvasStateId,
            eventEmitter,
            supportedResourceForms,
            selectedEdge
          ),
          onCancelLink(
            pixiCanvasStateId,
            eventEmitter,
            supportedResourceForms,
            selectedEdge
          )
        );
      } else {
        console.log('FDKSDFKSFSF', child.id);
        child.attachEventEmitter(eventEmitter);
        child.addLinkEvents(
          null,
          onEndLink(
            pixiCanvasStateId,
            eventEmitter,
            supportedResourceForms,
            selectedEdge
          ),
          onCancelLink(
            pixiCanvasStateId,
            eventEmitter,
            supportedResourceForms,
            selectedEdge
          )
        );
        child.container.alpha = 0.2;
      }
    }
  }
};
