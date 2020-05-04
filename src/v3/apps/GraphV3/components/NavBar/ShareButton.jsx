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
  },
  shareRow: {
    flexDirection: 'row'
  },
  imageRow: {
    paddingTop: '10px',
    flexDirection: 'row'
  },
  divider: {
    paddingTop: '10px',
    paddingBottom: '10px'
  },
  inlineDialogButton: {
    paddingleft: '5px',
    marginLeft: '5px',
    height: '100%'
  }
});

class ShareButton extends Component {
  render() {
    const { classes } = this.props;

    return (
      <IconDialog label="Share" icon={<ShareIcon />}>
        <div className={classes.shareDialog}>
          <div className={classes.shareRow}>
            <TextField
              spellCheck={false}
              inputRef={ref => (this.inputRef = ref)}
              label="Share Code"
              value={''}
              variant="outlined"
            />
            <Button
              color="primary"
              className={classes.inlineDialogButton}
              size="large"
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
              {/* <div className={classes.label}>Copy</div> */}
            </Button>
          </div>
          <div className={classes.divider}></div>
          <div className={classes.imageRow}>
            <Button
              fullWidth
              color="primary"
              size="large"
              endIcon={<PhotoSizeSelectActualIcon />}
            >
              <div className={classes.label}>Export Image</div>
            </Button>
          </div>
          {/*//TODO: Fix serialize*/}
          {/*<GraphSerializeButton />*/}
        </div>
      </IconDialog>
    );
  }
}

export default withStyles(styles)(ShareButton);
