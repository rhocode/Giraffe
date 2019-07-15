import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';

import GraphAppBarButton from './GraphAppBarButton';

const styles = theme => ({
  shareDialog: {
    display: 'flex',
    flexDirection: 'column'
  }
});

class GraphShareButton extends Component {
  render() {
    const { classes } = this.props;

    return (
      <GraphAppBarButton label="Share" icon={<ShareIcon />}>
        <div className={classes.shareDialog}>
          <TextField
            spellCheck={false}
            inputRef={ref => (this.inputRef = ref)}
            label="Share Code"
            value={''}
          />
          <Button
            color="primary"
            className={classes.inlineDialogButton}
            onClick={() =>
              new Promise(resolve => {
                this.inputRef.select();
                document.execCommand('copy');
                resolve(true);
              }).then(a => {
                this.setState({ statusMessage: 'Copied!' }, () => {
                  setTimeout(() => {
                    this.setState({ statusMessage: '' });
                  }, 3000);
                });
              })
            }
          >
            <FileCopyIcon />
            <div className={classes.label}>Copy Code</div>
          </Button>

          <Button fullWidth color="primary">
            <PhotoSizeSelectActualIcon />
            <div className={classes.label}>Export Image</div>
          </Button>
        </div>
      </GraphAppBarButton>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(withStyles(styles)(GraphShareButton));
