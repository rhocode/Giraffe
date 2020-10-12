import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import { motion, useAnimation } from 'framer-motion';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { addObjectChildren } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas/childrenApi';
import populateNewEdgeData from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/satisgraphtory/populateNewEdgeData';
import populateNewNodeData from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/satisgraphtory/populateNewNodeData';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import { triggerCanvasUpdate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { LocaleContext } from 'v3/components/LocaleProvider';
import { getConnectionsByResourceForm } from 'v3/data/loaders/buildings';
import { getItemResourceForm } from 'v3/data/loaders/items';
import {
  getMachinesFromMachineCraftableRecipe,
  getRecipeProducts,
  getRecipesByItemIngredient,
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

const fabAction = (
  translate,
  externalInteractionManager,
  pixiCanvasStateId
) => () => {
  // TODO: add graph actions.
  // const startingRecipe = getRecipeDefinition("recipe-pure-ore-iron");

  const selectedRecipe = 'recipe-pure-ore-iron';

  const machineChoices = getMachinesFromMachineCraftableRecipe(selectedRecipe);

  const machineChoicesIndex = Math.floor(Math.random() * machineChoices.length);
  const selectedMachine = machineChoices[machineChoicesIndex];

  let depth = 1;

  const nodeData = populateNewNodeData(
    selectedMachine,
    selectedRecipe,
    100,
    depth * 200,
    200,
    translate,
    externalInteractionManager
  );

  const allNodes = [nodeData];
  const allEdges = [];

  const queue = [
    {
      node: nodeData,
      depth,
      recipe: selectedRecipe,
    },
  ];

  let i = 0;
  while (i < 4 && queue.length) {
    const { node, depth, recipe } = queue.pop();
    const outputs = getRecipeProducts(recipe);

    outputs
      .map((item) => item.slug)
      .forEach((item, index) => {
        const recipes = getRecipesByItemIngredient(item).filter(
          (recipeSlug) => {
            const machineChoices = getMachinesFromMachineCraftableRecipe(
              recipeSlug
            );

            return machineChoices.length > 0;
          }
        );

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
            (depth + 1) * 200,
            200 * (index + 1),
            translate,
            externalInteractionManager
          );

          console.log('Created node', nodeData);

          allNodes.push(nodeData);

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

          const edge = populateNewEdgeData(
            [item],
            null,
            connection,
            node,
            nodeData
          );
          allEdges.push(edge);
          console.log('Created edge', edge);
        } else {
          console.error('No recipes for ', item);
        }
      });

    i++;
  }

  addObjectChildren(allNodes, pixiCanvasStateId, false);
  addObjectChildren(allEdges, pixiCanvasStateId, true);
  triggerCanvasUpdate(pixiCanvasStateId);
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
