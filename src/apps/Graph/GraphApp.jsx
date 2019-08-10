import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import GraphAppBar from './components/GraphAppBar';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import GraphCanvasLoadable from './components/GraphCanvasLoadable';
import GraphNodeDrawer from './components/GraphNodeDrawer';
import { setMachineClasses } from '../../redux/actions/Graph/graphActions';
import { getCraftingMachineClasses } from './graphql/queries';
import { getTranslate } from 'react-localize-redux';
// import GraphRightPanel from './components/GraphRightPanel';

const styles = theme => {
  console.log(theme);
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

class GraphApp extends Component {
  state = {
    ready: false
  };

  componentWillMount() {
    const { match } = this.props;

    const graphId = (match && match.params && match.params.graphId) || null;

    getCraftingMachineClasses().then(classes =>
      this.props.setMachineClasses(classes)
    );

    if (graphId) {
      fetch('https://api.myjson.com/bins/' + graphId)
        .then(resp => resp.json())
        .then(json => {
          this.setState({ ready: true, helmet: json });
        })
        .catch(err => {
          this.setState({
            ready: true,
            helmet: {
              title: 'SatisGraphtory | Factory Building Graph Simulation',
              description:
                'Feature-rich factory optimization and calculation tool for Satisfactory game',
              image: 'https://i.imgur.com/DPEmxE0.png'
            }
          });
        });
    } else {
      this.setState({
        ready: true,
        helmet: {
          title: 'SatisGraphtory | Factory Building Graph Simulation',
          description:
            'Feature-rich factory optimization and calculation tool for Satisfactory game',
          image: 'https://i.imgur.com/DPEmxE0.png'
        }
      });
    }
  }

  render() {
    const { classes } = this.props;

    const { ready, helmet } = this.state;

    if (ready) {
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
          <GraphAppBar />
          {/* <GraphRightPanel /> */}
          <GraphCanvasLoadable />

          <GraphNodeDrawer />
          {/*<div className={classes.thing1}>HELLO<br />HELLOHELLO<br />HELLOHELLO<br />HELLOHELLO<br />HELLOHELLO<br />HELLO</div>*/}
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}

const mapStateToProps = state => ({
  // ...state
  translate: getTranslate(state.localize)
});

const mapDispatchToProps = dispatch => ({
  setMachineClasses: classes => dispatch(setMachineClasses(classes))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphApp));
