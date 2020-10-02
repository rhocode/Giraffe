import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { getItemIcon } from "v3/data/loaders/items";
import QualitySelector from "v3/apps/GraphV3/components/ChainWizard/ChainWizardQuantitySelector";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ItemSelector from "v3/apps/GraphV3/components/ChainWizard/ItemSelector";
import { faBars, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import { SortableHandle } from "react-sortable-hoc";
import { useStoreState } from "pullstate";
import { graphWizardStore } from "v3/apps/GraphV3/stores/graphAppStore";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 7,
    paddingBottom: 5,
    paddingTop: 5,
    borderColor: theme.palette.divider,
    borderWidth: 1,
    borderStyle: "solid",
  },
}));

const gridStyles = makeStyles(() => ({
  root: {},
}));

const dragHandleStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 37,
    width: 37,
    cursor: "n-resize",
    pointerEvents: "auto",
  },
}));

const itemIcon = (slug) => {
  if (slug) {
    return (
      <div style={{ height: 37, width: 37 }}>
        <img alt={slug} height={37} width={37} src={getItemIcon(slug)} />
      </div>
    );
  }

  return <div style={{ height: 37, width: 37 }} />;
};

const DragHandle = SortableHandle(() => {
  const classes = dragHandleStyles();
  return (
    <div className={classes.root}>
      <FontAwesomeIcon icon={faBars} />
    </div>
  );
});

function ItemCard(props) {
  const classes = useStyles();
  const gridClasses = gridStyles();

  const { stateId, choices, disableDelete } = props;

  const storeData = useStoreState(
    graphWizardStore,
    (s) => {
      return s.products[stateId];
    },
    [stateId]
  );

  const removeEntryFn = () =>
    graphWizardStore.update((state) => {
      delete state.products[stateId];
      state.boxes.splice(state.boxes.indexOf(stateId), 1);
    });

  const { slug } = storeData;

  return (
    <Paper classes={classes} elevation={3}>
      <Grid
        classes={gridClasses}
        container
        direction="row"
        justify="space-between"
        spacing={2}
        alignItems="center"
      >
        <Grid item>
          <DragHandle />
        </Grid>
        <Grid item>
          <ItemSelector stateId={stateId} suggestions={choices} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item>{itemIcon(slug)}</Grid>
        <Grid item>
          <QualitySelector stateId={stateId} />
        </Grid>
        <Grid item style={{ paddingLeft: 0 }}>
          <ButtonGroup
            style={{ paddingTop: 1 }}
            size="small"
            aria-label="small outlined button group"
          >
            <Button
              onClick={removeEntryFn}
              style={{ height: 35 }}
              variant="contained"
              color="secondary"
              disabled={disableDelete}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ItemCard;
