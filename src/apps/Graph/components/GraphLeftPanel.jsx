import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';

const styles = theme => ({
  drawer: {
    width: theme.overrides.GraphDrawer.width,
    marginTop: theme.overrides.GraphAppBar.height
  }
});

class GraphLeftPanel extends Component {
  static generateLotsOfText() {
    const divList = [];
    for (let i = 0; i < 600; i++) {
      divList.push(<div key={i}>i</div>);
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
        anchor={'left'}
        open={true}
        // onClose={this.handleDrawerToggle}
        classes={{
          paper: classes.drawer
        }}
      >
        {GraphLeftPanel.generateLotsOfText()}
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
)(withStyles(styles)(GraphLeftPanel));
