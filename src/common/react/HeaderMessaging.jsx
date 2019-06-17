import React  from 'react';
import { withStyles } from '@material-ui/core/styles';
import {useServiceWorker} from "./ServiceWorkerProvider";
import { connect } from 'react-redux';
import {getTranslate} from "react-localize-redux";

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.primary.dark,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    cursor: 'pointer'
  },
  invisible: {
    display: 'none'
  }
});

function HeaderMessaging(props){
  const {assetsUpdateReady, updateAssets } = useServiceWorker();

  const update = () => {
    console.error("Updating assets...");
    updateAssets();
  };

  return (
    <div onClick={update} className={assetsUpdateReady ? props.classes.container :  props.classes.invisible}>
        {props.translate('headerMessaging_newData')}
    </div>
  );
}

const mapStateToProps = state => ({
  translate: getTranslate(state.localize)
});

export default connect(mapStateToProps)(withStyles(styles)(HeaderMessaging));
