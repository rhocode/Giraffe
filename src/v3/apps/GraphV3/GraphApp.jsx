import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { Helmet } from "react-helmet-async";

import LocaleProvider, { LocaleContext } from "../../components/LocaleProvider";
// import { graphAppStore } from './stores/graphAppStore';
import NavBar from "./components/NavBar";
import Canvas from "./components/Canvas";
// import ActionBar from './components/ActionBar';

// eslint-disable-next-line import/no-webpack-loader-syntax
// import worker from 'workerize-loader!./workertest';
// import NodeDrawer from './components/NodeDrawer';
import initRuntime from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/initRuntime";
import ChainWizardPanel from "v3/apps/GraphV3/components/ChainWizard/ChainWizardPanel";
import DebugFab from "v3/apps/GraphV3/components/DebugFab/DebugFab";
import { pixiJsStore } from "./libraries/SatisGraphtoryLib/stores/PixiJSStore";

const styles = (theme) => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      minHeight: theme.overrides.GraphAppBar.height,
    },
    container: {
      background: "#1D1E20",
      overflow: "hidden",
      gridArea: "body",
      display: "grid",
      gridTemplateAreas: `"header"
        "canvasArea"
        "bottomActions"`,
      gridTemplateRows: "auto minmax(0, 1fr) auto",
      gridTemplateColumns: "1fr",
    },
    inProgressImage: {
      maxWidth: "100%",
      maxHeight: "100%",
      display: "block",
    },
    flexItem: {
      flexGrow: 0,
    },
    flexItemGrow: {
      flexGrow: 1,
    },
    flexContainer: {
      display: "flex",
      flexDirection: "column",
    },
  };
};

function GraphApp(props) {
  const [helmet, setHelmet] = React.useState({});

  const { language } = React.useContext(LocaleContext);

  const { match, classes } = props;

  React.useEffect(() => {
    // let instance = worker();
    //
    // instance.expensive(1000).then(count => {
    //   console.log(`Ran ${count} loops`);
    // });
  }, []);

  const pixiApplication = pixiJsStore.useState((s) => s.application);

  React.useEffect(() => {
    const graphId = (match && match.params && match.params.graphId) || null;

    if (graphId) {
      fetch("https://api.myjson.com/bins/" + graphId)
        .then((resp) => resp.json())
        .then((json) => {
          setHelmet(json);
        })
        .catch((err) => {
          setHelmet({
            title: "SatisGraphtory | Factory Building Graph Simulation",
            description:
              "Feature-rich factory optimization and calculation tool for Satisfactory game",
            image: "https://i.imgur.com/DPEmxE0.png",
          });
        });
    } else {
      setHelmet({
        title: "SatisGraphtory | Factory Building Graph Simulation",
        description:
          "Feature-rich factory optimization and calculation tool for Satisfactory game",
        image: "https://i.imgur.com/DPEmxE0.png",
      });
    }
  }, [language.code, match, pixiApplication]);

  const urlParams = new URLSearchParams(window.location.search);

  const numNodes = parseInt(urlParams.get("numNodes"), 10) || 10;

  React.useEffect(() => {
    initRuntime(pixiApplication, numNodes);
    if (pixiApplication.stage) {
      pixiApplication.renderer.render(pixiApplication.stage);
      pixiJsStore.update((s) => {
        s.loaded = true;
      });
    }
  }, [numNodes, pixiApplication]);

  const loaded = pixiJsStore.useState((s) => {
    return s.loaded;
  });

  React.useEffect(() => {
    if (loaded) {
      window.prerenderReady = true;
    }
  }, [loaded]);

  return (
    <React.Fragment>
      {Object.values(helmet).length > 0 ? (
        <div className={classes.container}>
          <Helmet>
            <meta property="og:title" content={helmet.title} />
            <meta property="og:site_name" content={window.location.hostname} />
            <meta property="og:image" content={helmet.image} />
            <meta property="og:description" content={helmet.description} />
            <meta property="og:url " content={window.location.href} />
            <title>{helmet.title}</title>
          </Helmet>
          <Dialog aria-labelledby="customized-dialog-title" open={true}>
            <DialogTitle id="customized-dialog-title">
              Welcome to SatisGraphtory!
            </DialogTitle>
            <DialogContent dividers>
              <div className={classes.flexContainer}>
                <div className={classes.flexItem}>
                  <Typography gutterBottom>
                    We're hard at work building SatisGraphtory2! While we don't
                    have a release date yet, it's in active development! Join
                    our discord for updates, or reach out to us if you'd like to
                    help!
                  </Typography>
                </div>
                <div className={classes.flexItemGrow}>
                  <img
                    className={classes.inProgressImage}
                    src={
                      "https://cdn.discordapp.com/attachments/129647483738390528/730273312009093160/unknown.png"
                    }
                    onClick={() => {
                      window.open(
                        "https://www.youtube.com/watch?v=nvipzqwVzqM",
                        "_blank"
                      );
                    }}
                    alt={"inProgress"}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  window.open("https://discord.gg/ZRpcgqY", "_blank");
                }}
                color="primary"
              >
                Join our Discord!
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <div className={classes.container}>
          <NavBar />
          <Canvas />
        </div>
      )}
    </React.Fragment>
  );
}

//TODO: Fix this inner app to be a part of the outside app locale.
const InnerGraphApp = withStyles(styles)(GraphApp);

function GraphAppWithLocale(props) {
  return (
    <LocaleProvider>
      <InnerGraphApp {...props} />
    </LocaleProvider>
  );
}

export default GraphAppWithLocale;
