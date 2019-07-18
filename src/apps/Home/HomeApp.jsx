import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';

import {connect} from 'react-redux';
import LoadingBar from '../../common/react/LoadingBar';

const styles = theme => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      minHeight: theme.overrides.GraphAppBar.height
    },
    container: {
      background: '#333333',
      gridArea: 'body',
      display: "grid",
      gridTemplateAreas:
        `"fullHeight"`,
      gridTemplateRows: "1fr",
      gridTemplateColumns: "1fr",
    }
  };
};

class HomeApp extends Component {
  state = {
    status: 'Logged out'
  };

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        <LoadingBar loadingText heightOverride={100}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(
  mapStateToProps
)(withStyles(styles)(HomeApp));
