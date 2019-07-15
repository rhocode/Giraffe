import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  drawer: {
    width: theme.overrides.GraphDrawer.width,
    marginTop: theme.overrides.GraphAppBar.height
  },
  drawerContent: {
    padding: 20
  }
});

class GraphRightPanel extends Component {
  static generateLotsOfText() {
    const divList = [];
    for (let i = 0; i < 600; i++) {
      divList.push(<div key={i}>i{i}</div>);
    }
    return divList;
  }

  render() {
    const { classes } = this.props;

    return (
      <Drawer
        // container={this.props.container}
        // variant="temporary"
        variant="permanent"
        anchor={'right'}
        open={true}
        // onClose={this.handleDrawerToggle}
        classes={{
          paper: classes.drawer
        }}
      >
        {/* {GraphRightPanel.generateLotsOfText()} */}
        <div className={classes.drawerContent}>
          <Typography variant="h5">Node Settings</Typography>
        </div>
      </Drawer>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphRightPanel));
