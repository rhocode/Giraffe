import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { setMachineClasses } from '../../../redux/actions/Graph/graphActions';
import { getActiveLanguage, getTranslate } from 'react-localize-redux';
import { getPlaceableMachineClasses } from '../../../apps/Graph/graphql/queries';

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

  const { match, language, classes, setMachineClasses } = props;

  React.useEffect(() => {
    const graphId = (match && match.params && match.params.graphId) || null;

    getPlaceableMachineClasses(language.code === 'discord').then(classes => {
      console.error(classes);
      setMachineClasses(classes);
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
  }, [language.code, match, setHelmet, setMachineClasses]);

  if (Object.values(helmet).length > 0) {
    return (
      <div className={classes.container}>
        <Helmet>
          <meta property="og:title" content={helmet.title} />
          <meta property="og:site_name" content={window.location.hostname} />
          <meta property="og:image" content={helmet.image} />
          <meta property="og:description" content={helmet.description} />
          <meta property="og:url " content={window.location.href} />
          <title>{helmet.title}</title>
        </Helmet>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

const mapStateToProps = state => {
  return {
    // ...state
    language: getActiveLanguage(state.localize),
    translate: getTranslate(state.localize)
  };
};

const mapDispatchToProps = dispatch => ({
  setMachineClasses: classes => dispatch(setMachineClasses(classes))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphApp));
