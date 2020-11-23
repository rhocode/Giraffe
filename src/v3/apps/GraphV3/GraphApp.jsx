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

export default function GraphApp(props) {
  const [helmet, setHelmet] = React.useState({});

  const { language } = React.useContext(LocaleContext);

  const { match } = props;

  const classes = useStyles();

  const [data, setData] = React.useState({
    loaded: false,
    graph: {},
  });

  React.useEffect(() => {
    // let instance = worker();
    //
    // instance.expensive(1000).then(count => {
    //   console.log(`Ran ${count} loops`);
    // });
    // localizeGenerator(getAllRecipes())
  }, []);

  const onFinishLoad = React.useCallback(() => {
    window.prerenderReady = true;
    console.log('Finished loading');
  }, []);

  React.useEffect(() => {
    const graphId = (match && match.params && match.params.graphId) || null;
    let data;

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('useBlank')) {
      data = {
        d: 'AIACA===',
        c: 0,
        v: '0.1.0',
        h: -393418234,
        q: 'Lizard Doggo Approved',
        n: 'My Awesome Design',
      };
    } else {
      data = {
        d:
          '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',
        c: 1,
        v: '0.1.0',
        h: -517479046,
      };
    }

    if (graphId) {
      fetch(
        `https://www.googleapis.com/drive/v3/files/1parVWzimSkABuaUrS_TB9e-iaKOHsnIX?key=${process.env.REACT_APP_GCLOUD_API_KEY}&alt=media`
      )
        .then((resp) => resp.json())
        .then((resp) => {
          console.log('We were able to load!', resp);

          setHelmet({
            title: 'SatisGraphtory | Factory Building Graph Simulation',
            description:
              'Feature-rich factory optimization and calculation tool for Satisfactory game',
            image: 'https://i.imgur.com/DPEmxE0.png',
          });
        })
        .catch(() => {
          console.log('Graph was not loaded. Falling back for now.');
          setData({
            loaded: true,
            graph: {
              d: 'AIACA===',
              c: 0,
              v: '0.1.0',
            },
          });
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
      setData({
        loaded: true,
        graph: data,
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
          <NavBar id={pixiCanvasStateId} loaded={data.loaded} />
          <Canvas
            dataLoaded={data.loaded}
            id={pixiCanvasStateId}
            initialCanvasGraph={data.graph}
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
          <NavBar id={pixiCanvasStateId} />
        </div>
      )}
    </React.Fragment>
  );
}
