import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import { Helmet } from 'react-helmet-async';
import ActionBar from 'v3/apps/GraphV3/components/ActionBar/ActionBar';
import Canvas from 'v3/apps/GraphV3/components/Canvas/Canvas';
// eslint-disable-next-line import/no-webpack-loader-syntax
// import worker from 'workerize-loader!./workertest';
import DebugFab from 'v3/apps/GraphV3/components/DebugFab/DebugFab';
import EdgeSelectorPanel from 'v3/apps/GraphV3/components/EdgeSelectorPanel/EdgeSelectorPanel';

import NavBar from 'v3/apps/GraphV3/components/NavBar/NarBar';
import initCanvasChildren from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/initCanvasChildren';
import { LocaleContext } from 'v3/components/LocaleProvider';
import uuidGen from 'v3/utils/stringUtils';

const useStyles = makeStyles((theme) => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      minHeight: theme.overrides.GraphAppBar.height,
    },
    container: {
      background: '#1D1E20',
      overflow: 'hidden',
      gridArea: 'body',
      display: 'grid',
      gridTemplateAreas: `"header"
        "contentArea"
        "bottomActions"`,
      gridTemplateRows: 'auto minmax(0, 1fr) auto',
      gridTemplateColumns: '1fr',
    },
    inProgressImage: {
      maxWidth: '100%',
      maxHeight: '100%',
      display: 'block',
    },
    flexItem: {
      flexGrow: 0,
    },
    flexItemGrow: {
      flexGrow: 1,
    },
    flexContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
  };
});

function GraphApp(props) {
  const [helmet, setHelmet] = React.useState({});

  const { language } = React.useContext(LocaleContext);

  const { match } = props;

  const classes = useStyles();

  React.useEffect(() => {
    // let instance = worker();
    //
    // instance.expensive(1000).then(count => {
    //   console.log(`Ran ${count} loops`);
    // });
    // localizeGenerator(getAllRecipes())
  }, []);

  const initialCanvasChildren = React.useCallback(
    (application, viewport, translate, externalInteractionManager) => {
      console.log('Canvas load function called');
      return initCanvasChildren(
        application,
        viewport,
        translate,
        externalInteractionManager
      );
    },
    []
  );

  const onFinishLoad = React.useCallback(() => {
    window.prerenderReady = true;
    console.log('Finished loading');
  }, []);

  React.useEffect(() => {
    const graphId = (match && match.params && match.params.graphId) || null;

    if (graphId) {
      fetch('https://api.myjson.com/bins/' + graphId)
        .then((resp) => resp.json())
        .then((json) => {
          setHelmet(json);
        })
        .catch(() => {
          setHelmet({
            title: 'SatisGraphtory | Factory Building Graph Simulation',
            description:
              'Feature-rich factory optimization and calculation tool for Satisfactory game',
            image: 'https://i.imgur.com/DPEmxE0.png',
          });
        });
    } else {
      setHelmet({
        title: 'SatisGraphtory | Factory Building Graph Simulation',
        description:
          'Feature-rich factory optimization and calculation tool for Satisfactory game',
        image: 'https://i.imgur.com/DPEmxE0.png',
      });
    }
  }, [language.code, match]);

  const [pixiCanvasStateId] = React.useState(() => {
    return uuidGen();
  });

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
          <NavBar />
          <Canvas
            id={pixiCanvasStateId}
            initialCanvasChildren={initialCanvasChildren}
            onFinishLoad={onFinishLoad}
          >
            {/*<ChainWizardPanel />*/}
            <ActionBar />
            <DebugFab />
            <EdgeSelectorPanel />
            {/*<SimulationFab />*/}
          </Canvas>
        </div>
      ) : (
        <div className={classes.container}>
          <NavBar />
        </div>
      )}
    </React.Fragment>
  );
}

export default GraphApp;
