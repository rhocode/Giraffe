import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
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
import CustomListSubheader from 'v3/apps/GraphV3/components/ChainWizard/CustomListSubheader';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 700,
    marginTop: theme.overrides.GraphAppBar.height,
    height: `calc(100% - ${theme.overrides.GraphAppBar.height}px)`,
  },
  drawerNotCalculated: {
    width: 390,
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
    width: '200 important!',
  },
  container: {
    height: '100%',
  },
}));

const SortableItem = SortableElement(
  ({ boxId, itemChoices, disableDelete }) => (
    <ListItem key={boxId}>
      <ItemCard
        stateId={boxId}
        choices={itemChoices}
        disableDelete={disableDelete}
      />
    </ListItem>
  )
);

const SortableList = SortableContainer(
  ({ productsList, itemChoices, classes }) => {
    return (
      <List
        subheader={
          <CustomListSubheader disableSticky>
            Desired Outputs
          </CustomListSubheader>
        }
        className={classes.root}
      >
        {productsList.map((id, index) => {
          return (
            <SortableItem
              disableDelete={productsList.length === 1}
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
    s.result = output || {};
    s.calculated = true;
  });
};

const clearFunction = () => {
  const initialStateId = stringGen(10);
  graphWizardStore.update((s) => {
    s.boxes = [initialStateId];
    s.products = {
      [initialStateId]: { slug: null, amount: 1 },
    };
    s.result = {};
    s.constraints = {};
    s.calculated = false;
  });
};

const updateAutoCalculate = (event, val) => {
  graphWizardStore.update((s) => {
    s.autoCalculate = val;
  });
};

function ChainWizardPanel() {
  const classes = useStyles();

  const demoVar3 = '';

  const productsList = useStoreState(graphWizardStore, (s) => s.boxes);

  const { translate } = React.useContext(LocaleContext);

  const products = Object.values(
    graphWizardStore.useState((s) => s.products)
  ).filter((item) => item.slug && item.amount > 0);

  const constraints = Object.values(
    graphWizardStore.useState((s) => s.constraints)
  );

  const autoCalculate = useStoreState(graphWizardStore, (s) => s.autoCalculate);

  React.useEffect(() => {
    if (autoCalculate) {
      calculateFunction(products, constraints)();
    }
  }, [products, constraints, autoCalculate]);

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

  const calculated = useStoreState(graphWizardStore, (s) => s.calculated);

  return (
    <React.Fragment>
      <Drawer
        variant="temporary"
        anchor={'left'}
        // open={drawerOpen}
        open={false}
        // onClose={() => setDrawerOpen(false)}
        classes={{
          paper: calculated ? classes.drawer : classes.drawerNotCalculated,
        }}
      >
        <Grid classes={gridItemStyle} container>
          <Grid xs={calculated ? 7 : 12} item classes={gridItemStyle}>
            <List className={classes.root}>
              <ListItem>
                <Grid
                  container
                  spacing={1}
                  direction="row"
                  justify="flex-start"
                  alignItems="center"
                >
                  <Grid item>
                    <Button
                      onClick={calculateFunction(products, constraints)}
                      variant="contained"
                      color="primary"
                    >
                      Calculate
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={clearFunction}
                      variant="contained"
                      color="secondary"
                    >
                      Clear
                    </Button>
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={autoCalculate}
                          onChange={updateAutoCalculate}
                          name="checkedG"
                        />
                      }
                      label="Auto-Update"
                    />
                  </Grid>
                </Grid>
              </ListItem>
            </List>
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
                  <UsedConstraints />
                </List>
              </Scrollbar>
            </div>
          </Grid>
          {calculated ? (
            <Grid xs={5} item classes={gridItemStyle}>
              <div className={classes.tabContent}>
                <Scrollbar className={classes.scrollableTabContent}>
                  <OutputSubPanel />
                </Scrollbar>
              </div>
            </Grid>
          ) : null}
        </Grid>
      </Drawer>
    </React.Fragment>
  );
}

export default ChainWizardPanel;
