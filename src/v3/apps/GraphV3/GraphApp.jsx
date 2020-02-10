import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Helmet } from 'react-helmet-async';

import LocaleProvider, { LocaleContext } from '../../components/LocaleProvider';
import { graphAppStore } from './stores/graphAppStore';
import { getPlaceableMachineClasses } from '../../graphql/queries';
import NavBar from './components/NavBar';
import Canvas from './components/Canvas';
import ActionBar from './components/ActionBar';

// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!./workertest';
import NodeDrawer from './components/NodeDrawer';

const styles = theme => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      minHeight: theme.overrides.GraphAppBar.height
    },
    container: {
      background: '#1D1E20',
      overflow: 'hidden',
      gridArea: 'body',
      display: 'grid',
      gridTemplateAreas: `"header"
        "canvasArea"
        "bottomActions"`,
      gridTemplateRows: 'auto minmax(0, 1fr) auto',
      gridTemplateColumns: '1fr'
    },
    thing1: {
      gridArea: 'bottomActions'
    }
  };
};

function GraphApp(props) {
  const [helmet, setHelmet] = React.useState({});

  const { language } = React.useContext(LocaleContext);

  const { match, classes } = props;

  React.useEffect(() => {
    let instance = worker();

    instance.expensive(1000).then(count => {
      console.log(`Ran ${count} loops`);
    });

    console.log('AJMKDSKDSD');
  }, []);

  React.useEffect(() => {
    const graphId = (match && match.params && match.params.graphId) || null;

    getPlaceableMachineClasses({
      useAltImages: language.code === 'discord'
    }).then(classes => {
      console.log('Loaded the machine classes', classes);
      graphAppStore.update(s => {
        s.placeableMachineClasses = classes;
      });
    });

    if (graphId) {
      fetch('https://api.myjson.com/bins/' + graphId)
        .then(resp => resp.json())
        .then(json => {
          setHelmet(json);
        })
        .catch(err => {
          setHelmet({
            title: 'SatisGraphtory | Factory Building Graph Simulation',
            description:
              'Feature-rich factory optimization and calculation tool for Satisfactory game',
            image: 'https://i.imgur.com/DPEmxE0.png'
          });
        });
    } else {
      setHelmet({
        title: 'SatisGraphtory | Factory Building Graph Simulation',
        description:
          'Feature-rich factory optimization and calculation tool for Satisfactory game',
        image: 'https://i.imgur.com/DPEmxE0.png'
      });
    }
  }, [language.code, match]);

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
          <Canvas>
            <ActionBar />
          </Canvas>
          <NodeDrawer />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </React.Fragment>
  );
}

//TODO: Fix this inner app to be a part of the outside app locale.
const InnerGraphApp = withStyles(styles)(GraphApp);

function GraphAppWithLocale() {
  return (
    <LocaleProvider>
      <InnerGraphApp />
    </LocaleProvider>
  );
}

export default GraphAppWithLocale;
