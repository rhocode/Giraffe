import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SettingsIcon from '@material-ui/icons/Settings';

import GraphAppBarButton from './GraphAppBarButton';

const styles = theme => ({});

class GraphSettingsButton extends Component {
  render() {
    const { classes } = this.props;

    return (
      <GraphAppBarButton label="Settings" icon={<SettingsIcon />}>
        hi
      </GraphAppBarButton>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(
  withStyles(styles)(GraphSettingsButton)
);
