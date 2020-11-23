import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import * as dagre from 'dagre';
import { motion, useAnimation } from 'framer-motion';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { GRID_SIZE } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Sizes';
import { addObjectChildren } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas/childrenApi';
import {
  optimizeSidesFunction,
  rearrangeEdgesFunction,
  updateChildrenFunction,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/satisgraphtory/layout/graphLayout';
import populateNewEdgeData from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/satisgraphtory/populateNewEdgeData';
import populateNewNodeData from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/satisgraphtory/populateNewNodeData';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import {
  pixiJsStore,
  triggerCanvasUpdateFunction,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { LocaleContext } from 'v3/components/LocaleProvider';
import { getConnectionsByResourceForm } from 'v3/data/loaders/buildings';
import { getItemResourceForm } from 'v3/data/loaders/items';
import {
  getMachinesFromMachineCraftableRecipe,
  getRecipeIngredients,
  getRecipesByItemProduct,
} from 'v3/data/loaders/recipes';

const useStyles = makeStyles((theme) => ({
  fabMotion: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  fab: {
    position: 'absolute',
    bottom: '2em',
    right: '2em',
    zIndex: theme.zIndex.drawer + 1,
    pointerEvents: 'auto',
  },
  fabMobile: {
    position: 'absolute',
    bottom: '7em',
    right: '2em',
    zIndex: theme.zIndex.drawer + 1,
    pointerEvents: 'auto',
  },
}));

export const makeComplexChain = (
  translate,
  externalInteractionManager,
  pixiCanvasStateId
) => {
  const endingItem = 'item-space-elevator-part-5';

  const possibleRecipes = getRecipesByItemProduct(endingItem);

  const possibleRecipesIndex = Math.floor(
    Math.random() * possibleRecipes.length
  );
  const selectedRecipe = possibleRecipes[possibleRecipesIndex];

  const machineChoices = getMachinesFromMachineCraftableRecipe(selectedRecipe);

  const machineChoicesIndex = Math.floor(Math.random() * machineChoices.length);
  const selectedMachine = machineChoices[machineChoicesIndex];

  let depth = 1;

  const maxDepth = Infinity;

  const nodeData = populateNewNodeData(
    selectedMachine,
    selectedRecipe,
    100,
    -1 * depth * 300,
    300,
    translate,
    externalInteractionManager
  );

  const allNodes = [nodeData];
  const allEdges = [];

  const nodeMap = new Map();

  const g = new dagre.graphlib.Graph();

  g.setGraph({
    rankdir: 'LR',
    // align: 'DL',
    ranker: 'tight-tree',
    nodesep: 300,
    ranksep: 300,
  });

  g.setDefaultEdgeLabel(function () {
    return {};
  });

  const queue = [
    {
      node: nodeData,
      depth,
      recipe: selectedRecipe,
    },
  ];

  g.setNode(nodeData.id, { label: nodeData.id, width: 150, height: 150 });
  nodeMap.set(nodeData.id, nodeData);
  let i = 0;
  while (i < maxDepth && queue.length) {
    const { node, depth, recipe } = queue.pop();
    const outputs = getRecipeIngredients(recipe);

    outputs
      .map((item) => item.slug)
      .forEach((item, index) => {
        const recipes = getRecipesByItemProduct(item).filter((recipeSlug) => {
          if (
            recipeSlug.indexOf('-unpackage-') !== -1 ||
            recipeSlug.indexOf('-packaged-') !== -1
          ) {
            return false;
          }

          const machineChoices = getMachinesFromMachineCraftableRecipe(
            recipeSlug
          );

          return machineChoices.length > 0;
        });

        // console.log('Item product', recipes, item);

        if (recipes.length) {
          const chosenRecipeIndex = Math.floor(Math.random() * recipes.length);
          const selectedRecipe = recipes[chosenRecipeIndex];

          const machineChoices = getMachinesFromMachineCraftableRecipe(
            selectedRecipe
          );

          const machineChoicesIndex = Math.floor(
            Math.random() * machineChoices.length
          );
          const selectedMachine = machineChoices[machineChoicesIndex];

          const nodeData = populateNewNodeData(
            selectedMachine,
            selectedRecipe,
            100,
            (depth + 1) * -300,
            300 * (index + 1),
            translate,
            externalInteractionManager
          );

          // console.log('Created node', nodeData);

          allNodes.push(nodeData);

          g.setNode(nodeData.id, {
            label: nodeData.id,
            width: 150,
            height: 150,
          });

          nodeMap.set(nodeData.id, nodeData);

          //
          queue.push({
            node: nodeData,
            depth: depth + 1,
            recipe: selectedRecipe,
          });

          const possibleConnections = getConnectionsByResourceForm(
            getItemResourceForm(item)
          );
          const possibleConnectionsIndex = Math.floor(
            Math.random() * possibleConnections.length
          );
          const connection = possibleConnections[possibleConnectionsIndex];

          g.setEdge(nodeData.id, node.id, { minlen: 0.5 });

          const edge = populateNewEdgeData(
            [item],
            null,
            connection,
            nodeData,
            node,
            getRandomArbitrary(1, 5),
            getRandomArbitrary(1, 5)
          );

          allEdges.push(edge);
          // console.log('Created edge', edge);
        } else {
          console.error('No recipes that take ', item, ' as an input');
        }
      });

    i++;
  }

  dagre.layout(g);

  let minPoint = [0, 0];
  let distance = Infinity;

  g.nodes().forEach(function (v) {
    const metadata = g.node(v);
    if (metadata) {
      var a = metadata.x;
      var b = metadata.y;

      var c = Math.sqrt(a * a + b * b);
      if (c < distance) {
        distance = c;
        minPoint = [metadata.x, metadata.y];
      }
    }
  });

  minPoint[0] += 100;
  minPoint[1] += 100;

  g.nodes().forEach(function (v) {
    const metadata = g.node(v);
    if (metadata) {
      const node = nodeMap.get(v);
      node.setPosition(
        Math.floor((metadata.x - minPoint[0]) / GRID_SIZE) * GRID_SIZE,
        Math.floor((metadata.y - minPoint[1]) / GRID_SIZE) * GRID_SIZE
      );
    } else {
      console.log('Node ' + v + ': ' + JSON.stringify(g.node(v)));
    }
  });

  addObjectChildren(allNodes, pixiCanvasStateId, false);
  addObjectChildren(allEdges, pixiCanvasStateId, true);
};
//
// export const makeSimpleChain = (
//   translate,
//   externalInteractionManager,
//   pixiCanvasStateId
// ) => {
//   // TODO: add graph actions.
//   // const startingRecipe = getRecipeDefinition("recipe-pure-ore-iron");
//
//   const selectedRecipe = 'recipe-pure-ore-iron';
//
//   const machineChoices = getMachinesFromMachineCraftableRecipe(selectedRecipe);
//
//   const machineChoicesIndex = Math.floor(Math.random() * machineChoices.length);
//   const selectedMachine = machineChoices[machineChoicesIndex];
//
//   let depth = 1;
//
//   const maxDepth = 100;
//
//   const nodeData = populateNewNodeData(
//     selectedMachine,
//     selectedRecipe,
//     100,
//     depth * 300,
//     300,
//     translate,
//     externalInteractionManager
//   );
//
//   const allNodes = [nodeData];
//   const allEdges = [];
//
//   const queue = [
//     {
//       node: nodeData,
//       depth,
//       recipe: selectedRecipe,
//     },
//   ];
//
//   let i = 0;
//   while (i < maxDepth && queue.length) {
//     const { node, depth, recipe } = queue.pop();
//     const outputs = getRecipeProducts(recipe);
//
//     outputs
//       .map((item) => item.slug)
//       .forEach((item, index) => {
//         const recipes = getRecipesByItemIngredient(item).filter(
//           (recipeSlug) => {
//             const machineChoices = getMachinesFromMachineCraftableRecipe(
//               recipeSlug
//             );
//
//             return machineChoices.length > 0;
//           }
//         );
//
//         if (recipes.length) {
//           const chosenRecipeIndex = Math.floor(Math.random() * recipes.length);
//           const selectedRecipe = recipes[chosenRecipeIndex];
//
//           const machineChoices = getMachinesFromMachineCraftableRecipe(
//             selectedRecipe
//           );
//
//           const machineChoicesIndex = Math.floor(
//             Math.random() * machineChoices.length
//           );
//           const selectedMachine = machineChoices[machineChoicesIndex];
//
//           const nodeData = populateNewNodeData(
//             selectedMachine,
//             selectedRecipe,
//             100,
//             (depth + 1) * 300,
//             300 * (index + 1),
//             translate,
//             externalInteractionManager
//           );
//
//           console.log('Created node', nodeData);
//
//           allNodes.push(nodeData);
//
//           queue.push({
//             node: nodeData,
//             depth: depth + 1,
//             recipe: selectedRecipe,
//           });
//
//           const possibleConnections = getConnectionsByResourceForm(
//             getItemResourceForm(item)
//           );
//           const possibleConnectionsIndex = Math.floor(
//             Math.random() * possibleConnections.length
//           );
//           const connection = possibleConnections[possibleConnectionsIndex];
//
//           const edge = populateNewEdgeData(
//             [item],
//             null,
//             connection,
//             node,
//             nodeData,
//             getRandomArbitrary(0, 5),
//             getRandomArbitrary(0, 5),
//           );
//           allEdges.push(edge);
//           console.log('Created edge', edge);
//         } else {
//           console.error('No recipes that take ', item, ' as an input');
//         }
//       });
//
//     i++;
//   }
//
//   addObjectChildren(allNodes, pixiCanvasStateId, false);
//   addObjectChildren(allEdges, pixiCanvasStateId, true);
//
//   // for (const node of allNodes) {
//   //   node.recalculateConnections(false);
//   // }
//   //
//   // for (const node of allNodes) {
//   //   node.optimizeSides();
//   // }
//   //
//   // for (const node of allNodes) {
//   //   node.recalculateConnections();
//   // }
//
//   triggerCanvasUpdate(pixiCanvasStateId);
// };

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const fabAction = (
  translate,
  externalInteractionManager,
  pixiCanvasStateId
) => () => {
  makeComplexChain(translate, externalInteractionManager, pixiCanvasStateId);

  pixiJsStore.update([
    optimizeSidesFunction(pixiCanvasStateId),
    rearrangeEdgesFunction(pixiCanvasStateId),
    updateChildrenFunction(pixiCanvasStateId),
    triggerCanvasUpdateFunction(pixiCanvasStateId),
  ]);
};

function DebugFab() {
  const classes = useStyles();

  const controls = useAnimation();

  const { canvasReady: loaded, pixiCanvasStateId } = React.useContext(
    PixiJSCanvasContext
  );

  React.useEffect(() => {
    if (loaded) {
      controls.start('visible');
    }
  }, [controls, loaded]);

  const { translate } = React.useContext(LocaleContext);
  const { externalInteractionManager } = React.useContext(PixiJSCanvasContext);

  return (
    <motion.div
      className={classes.fabMotion}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { x: 0 },
        hidden: { x: 100 },
      }}
    >
      <Fab
        color="primary"
        className={isMobile ? classes.fabMobile : classes.fab}
        onClick={fabAction(
          translate,
          externalInteractionManager,
          pixiCanvasStateId
        )}
      >
        <SettingsApplicationsIcon />
      </Fab>
    </motion.div>
  );
}

export default React.memo(DebugFab);
