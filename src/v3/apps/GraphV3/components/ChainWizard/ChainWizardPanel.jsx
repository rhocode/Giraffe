import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { getMachineCraftableItems } from 'v3/data/loaders/items';
import ItemCard from 'v3/apps/GraphV3/components/ChainWizard/ItemCard';
import { LocaleContext } from 'v3/components/LocaleProvider';
import { useStoreState } from 'pullstate';
import { graphWizardStore } from 'v3/apps/GraphV3/stores/graphAppStore';
import arrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import stringGen from 'v3/utils/stringGen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Button from '@material-ui/core/Button';
import Scrollbar from 'react-scrollbars-custom';
import Grid from '@material-ui/core/Grid';
import { wizardSolver } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/solver';
import OutputSubPanel from 'v3/apps/GraphV3/components/ChainWizard/OutputSubPanel';
import UsedConstraints from 'v3/apps/GraphV3/components/ChainWizard/Constraint/UsedConstraints';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 840,
    marginTop: theme.overrides.GraphAppBar.height,
    height: `calc(100% - ${theme.overrides.GraphAppBar.height}px)`,
  },
  drawerContent: {
    padding: 20,
  },
  sortableList: {
    zIndex: theme.zIndex.modal,
  },
  tabContent: {
    overflow: 'hidden',
    flexGrow: 1,
    position: 'relative',
  },
  scrollableTabContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
  },
}));

const gridItemStyles = makeStyles((theme) => ({
  item: {
    height: '100%',
    flexDirection: 'column',
    display: 'flex',
  },
  container: {
    height: '100%',
  },
}));

const SortableItem = SortableElement(({ boxId, itemChoices }) => (
  <ListItem key={boxId}>
    <ItemCard stateId={boxId} choices={itemChoices} />
  </ListItem>
));

const SortableList = SortableContainer(
  ({ productsList, itemChoices, classes }) => {
    return (
      <List
        subheader={<ListSubheader disableSticky>Desired Outputs</ListSubheader>}
        className={classes.root}
      >
        {productsList.map((id, index) => {
          return (
            <SortableItem
              key={id}
              index={index}
              boxId={id}
              itemChoices={itemChoices}
            />
          );
        })}
        <ListItem key={'addBox'}>
          <Button
            onClick={addEntryFn}
            style={{ width: 354 }}
            variant="contained"
            color="primary"
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </ListItem>
      </List>
    );
  }
);

const addEntryFn = () =>
  graphWizardStore.update((state) => {
    const newId = stringGen(10);
    state.products[newId] = { slug: null, amount: 1 };
    state.boxes.push(newId);
  });

const calculateFunction = (products, constraints) => () => {
  const output = wizardSolver(
    products.map((item) => {
      return { slug: item.slug, perMinute: item.amount };
    }),
    constraints
  );

  graphWizardStore.update((s) => {
    s.result = output;
  });
};

function ChainWizardPanel() {
  const classes = useStyles();

  const productsList = useStoreState(graphWizardStore, (s) => s.boxes);

  const { translate } = React.useContext(LocaleContext);

  const products = Object.values(
    graphWizardStore.useState((s) => s.products)
  ).filter((item) => item.slug && item.amount > 0);

  const constraints = Object.values(
    graphWizardStore.useState((s) => s.constraints)
  );

  const [itemChoices] = React.useState(
    getMachineCraftableItems()
      .map((slug) => {
        return {
          label: translate(slug),
          value: slug,
        };
      })
      .sort((a, b) => {
        return a.label.localeCompare(b.label);
      })
  );

  const onSortEnd = ({ oldIndex, newIndex }) => {
    graphWizardStore.update((state) => {
      state.boxes = arrayMove(state.boxes, oldIndex, newIndex);
    });
  };

  const gridItemStyle = gridItemStyles();

  return (
    <React.Fragment>
      <Drawer
        variant="temporary"
        anchor={'left'}
        // open={drawerOpen}
        open={true}
        // onClose={() => setDrawerOpen(false)}
        classes={{
          paper: classes.drawer,
        }}
      >
        <Grid classes={gridItemStyle} container>
          <Grid xs={6} item classes={gridItemStyle}>
            <div className={classes.tabContent}>
              <Scrollbar className={classes.scrollableTabContent}>
                <SortableList
                  onSortEnd={onSortEnd}
                  helperClass={classes.sortableList}
                  productsList={productsList}
                  classes={classes}
                  itemChoices={itemChoices}
                  useDragHandle={true}
                />
                <List>
                  <ListSubheader disableSticky>Constraints</ListSubheader>
                  <UsedConstraints />
                </List>
              </Scrollbar>
            </div>
          </Grid>
          <Grid xs={6} item classes={gridItemStyle}>
            <List className={classes.root}>
              <ListItem>
                <Button
                  onClick={calculateFunction(products, constraints)}
                  variant="contained"
                  color="primary"
                >
                  Calculate
                </Button>
              </ListItem>
            </List>
            <div className={classes.tabContent}>
              <Scrollbar className={classes.scrollableTabContent}>
                <OutputSubPanel />
              </Scrollbar>
            </div>
          </Grid>
        </Grid>
      </Drawer>
    </React.Fragment>
  );
}

export default ChainWizardPanel;
