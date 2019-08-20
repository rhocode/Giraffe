import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { setMachineClasses } from '../../redux/actions/Graph/graphActions';
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

class Playground extends Component {
  state = {
    ready: false
  };

  componentWillMount() {}

  render() {
    const { classes } = this.props;

    return <div />;
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
)(withStyles(styles)(Playground));
