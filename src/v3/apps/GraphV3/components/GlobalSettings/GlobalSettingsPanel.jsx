import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import {
  Button,
  Divider,
  FormGroup,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Checkbox,
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import BuildIcon from "@material-ui/icons/Build";
import FlareIcon from "@material-ui/icons/Flare";
import SettingsIcon from "@material-ui/icons/Settings";
import { getMachineCraftableRecipeDefinitionList } from "v3/data/loaders/recipes";
import { LocaleContext } from "v3/components/LocaleProvider";
import { getItemIcon } from "v3/data/loaders/items";
import Scrollbar from "react-scrollbars-custom";

const styles = (theme) => ({
  drawer: {
    width: theme.overrides.GraphDrawer.width * 2.5,
    marginTop: theme.overrides.GraphAppBar.height,
    height: `calc(100% - ${theme.overrides.GraphAppBar.height}px)`,
  },
  drawerContent: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  tabContent: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
  list: {
    overflow: "hidden",
    flexGrow: 1,
    position: "relative",
  },
  innerList: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: "auto",
  },
  icon: {
    height: 30,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});

function GlobalSettingsPanel(props) {
  const [tabValue, setTabValue] = React.useState(0);

  function handleChange(event, newValue) {
    setTabValue(newValue);
  }

  // setDrawerOpen, drawerOpen
  const { classes } = props;

  const { translate } = React.useContext(LocaleContext);
  const [alternateRecipes] = React.useState(
    getMachineCraftableRecipeDefinitionList()
      .filter(({ slug }) => slug.indexOf("-alternate-") !== -1)
      .sort((a, b) => {
        return translate(a.slug).localeCompare(translate(b.slug));
      })
  );

  const [regularRecipes] = React.useState(
    getMachineCraftableRecipeDefinitionList()
      .filter(({ slug }) => slug.indexOf("-alternate-") === -1)
      .sort((a, b) => {
        return translate(a.slug).localeCompare(translate(b.slug));
      })
  );

  return (
    <Drawer
      //variant={isMobile ? "permanent" : "temporary" }
      variant="temporary"
      anchor={"right"}
      //   open={drawerOpen}
      open={true}
      // onClose={() => setDrawerOpen(false)}
      classes={{
        paper: classes.drawer,
      }}
    >
      <div className={classes.drawerContent}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          variant="fullWidth"
          centered
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Settings" icon={<SettingsIcon />} />
          <Tab label="Alternate Recipes" icon={<BuildIcon />} />
          <Tab label="Default Recipes" icon={<FlareIcon />} />
        </Tabs>
        {tabValue === 0 && (
          <div className={classes.tabContent}>
            <Typography variant="h5">Settings</Typography>
            <Divider className={classes.divider} />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    // checked={graphFidelity === 'high'}
                    // onChange={handleChange}
                    // value={graphFidelity}
                    color="primary"
                  />
                }
                label="High Fidelity Graph"
              />
            </FormGroup>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Analyze
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={() => {
                // if (graphData) {
                // transformGraph(graphData, () => {
                //   forceRefreshGraph();
                // });
                // }
              }}
            >
              Optimize
            </Button>
          </div>
        )}
        {tabValue === 1 && (
          <div className={classes.tabContent}>
            <Typography variant="h5">Alternate Recipes</Typography>
            <Divider className={classes.divider} />
            <div className={classes.list}>
              <div className={classes.innerList}>
                <Scrollbar>
                  <List>
                    {alternateRecipes.map(({ slug: item, products }) => {
                      return (
                        <ListItem button key={"key" + item}>
                          <ListItemIcon>
                            <img
                              className={classes.icon}
                              src={getItemIcon(products[0].slug)}
                              alt={item}
                            />
                          </ListItemIcon>
                          <ListItemText
                            id={"toggle-" + item}
                            primary={translate(item)}
                          />
                          <ListItemSecondaryAction>
                            <Checkbox edge="end" />
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                </Scrollbar>
              </div>
            </div>
          </div>
        )}
        {tabValue === 2 && (
          <div className={classes.tabContent}>
            <Typography variant="h5">Default Recipes</Typography>
            <Divider className={classes.divider} />
            <div className={classes.list}>
              <div className={classes.innerList}>
                <Scrollbar>
                  <List>
                    {regularRecipes.map(({ slug: item, products }) => {
                      return (
                        <ListItem button key={"key" + item}>
                          <ListItemIcon>
                            <img
                              className={classes.icon}
                              src={getItemIcon(products[0].slug)}
                              alt={item}
                            />
                          </ListItemIcon>
                          <ListItemText
                            id={"toggle-" + item}
                            primary={translate(item)}
                          />
                          <ListItemSecondaryAction>
                            <Checkbox edge="end" />
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                </Scrollbar>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}

export default withStyles(styles)(GlobalSettingsPanel);
