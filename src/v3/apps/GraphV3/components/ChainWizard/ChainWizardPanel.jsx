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
import Button from '@material-ui/core/Button';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import stringGen from 'v3/utils/stringGen';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: '80%',
    marginTop: theme.overrides.GraphAppBar.height,
    height: `calc(100% - ${theme.overrides.GraphAppBar.height}px)`,
  },
  drawerContent: {
    padding: 20,
  },
  root: {
    color: 'red',
  },
}));

function ChainWizardPanel() {
  const classes = useStyles();

  const productsList = useStoreState(graphWizardStore, (s) => s.products);

  const { translate } = React.useContext(LocaleContext);

  // Set as pullState?
  // setItemChoices
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

  const addEntryFn = () =>
    graphWizardStore.update((state) => {
      state.products.push({ id: stringGen(10), slug: null, amount: 1 });
    });

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
        <List
          subheader={<ListSubheader disableSticky>Settings</ListSubheader>}
          className={classes.root}
        >
          {productsList.map((item) => {
            const { slug: itemSlug } = item;
            return (
              <ListItem key={itemSlug}>
                <ItemCard slug={itemSlug} choices={itemChoices} />
              </ListItem>
            );
          })}
          <ListItem>
            <Button fullWidth variant="outlined" onClick={addEntryFn}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  );
}

export default ChainWizardPanel;
