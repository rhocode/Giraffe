import React  from 'react';
import { withStyles } from '@material-ui/core/styles';
import {useServiceWorker} from "./ServiceWorkerProvider";
import { connect } from 'react-redux';
import {getTranslate} from "react-localize-redux";

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.primary.dark,
    height: theme.overrides.common.HeaderMessaging.height,
    gridArea: 'update',
    textAlign: 'center',
    cursor: 'pointer',
    zIndex: theme.zIndex.drawer + 2,
    display: "table",
    overflow: "hidden",
    width: "100%",
  },
  invisible: {
    gridArea: 'update',
    display: 'none'
  },
  messaging: {
    display: "table-cell",
    verticalAlign: 'middle'
  }
});

function HeaderMessaging(props){
  const {assetsUpdateReady, updateAssets } = useServiceWorker();

  const update = () => {
    console.error("Updating assets...");
    updateAssets();
  };

  return (
    <div onClick={update} className={true ? props.classes.container :  props.classes.invisible}>
      <div className={props.classes.messaging}>{props.translate('headerMessaging_newData')}</div>
    </div>
  );
}

const mapStateToProps = state => ({
  translate: getTranslate(state.localize)
});

export default connect(mapStateToProps)(withStyles(styles)(HeaderMessaging));
