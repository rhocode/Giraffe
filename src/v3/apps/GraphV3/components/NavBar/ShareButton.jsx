import React, { Component } from 'react';
import ShareIcon from '@material-ui/icons/Share';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';
import IconDialog from './IconDialog';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  shareDialog: {
    display: 'flex',
    flexDirection: 'column'
  }
});

class ShareButton extends Component {
  render() {
    const { classes } = this.props;

    return (
      <IconDialog label="Share" icon={<ShareIcon />}>
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
          {/*//TODO: Fix serialize*/}
          {/*<GraphSerializeButton />*/}
        </div>
      </IconDialog>
    );
  }
}

export default withStyles(styles)(ShareButton);
