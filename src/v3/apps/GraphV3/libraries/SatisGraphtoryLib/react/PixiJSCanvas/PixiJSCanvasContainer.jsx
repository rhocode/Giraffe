import { createStyles, makeStyles } from '@material-ui/core/styles';
import AutoSizedLoadingWrapper from 'common/react/AutoSizedLoadingWrapper';
import React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import NodeDrawer from 'v3/apps/GraphV3/components/NodeDrawer/NodeDrawer';
import ObjectSettingPanel from 'v3/apps/GraphV3/components/ObjectSettings/ObjectSettingPanel';
import PixiJSApplication from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJSApplication';

import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';

const useStyles = makeStyles(() =>
  createStyles({
    canvasContainer: {
      display: 'grid',
      gridArea: 'contentArea',
      gridTemplateAreas: `"canvasElement"`,
      gridTemplateRows: 'minmax(0, 1fr)',
      gridTemplateColumns: '1fr',
      minWidth: 1,
      minHeight: 1,
      position: 'relative',
    },
    canvas: {
      gridArea: 'canvasElement',
      minWidth: 1,
      minHeight: 1,
    },
    relativePositionDiv: {
      position: 'relative',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    centeredLoader: {
      flexGrow: 1,
    },
    childOverlay: {
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
    },
  })
);

function PixiJSCanvasGuard(props) {
  const { height, width, ...restProps } = props;

  const { canvasReady: loaded } = React.useContext(PixiJSCanvasContext);

  if (!height || !width) {
    return null;
  }

  return (
    <PixiJSApplication
      hidden={!loaded}
      height={height}
      width={width}
      {...restProps}
    />
  );
}

function CenteredLoader() {
  const classes = useStyles();

  const { canvasReady: loaded } = React.useContext(PixiJSCanvasContext);

  if (loaded) {
    return null;
  }

  return (
    <div className={classes.relativePositionDiv}>
      <div className={classes.centeredLoader}>
        <AutoSizedLoadingWrapper />
      </div>
    </div>
  );
}

function PixiJSCanvasContainer(props) {
  const classes = useStyles();
  const { children, ...restProps } = props;

  return (
    <React.Fragment>
      <div className={classes.canvasContainer}>
        <ReactResizeDetector
          refreshMode={'throttle'}
          refreshOptions={{ leading: true, trailing: true }}
          refreshRate={100}
          handleWidth
          handleHeight
        >
          {({ width, height }) => (
            <div className={classes.canvas}>
              <CenteredLoader />
              <PixiJSCanvasGuard height={height} width={width} {...restProps} />
              <div className={classes.childOverlay}>{children}</div>
            </div>
          )}
        </ReactResizeDetector>
        <ObjectSettingPanel />
      </div>
      <NodeDrawer />
    </React.Fragment>
  );
}

export default PixiJSCanvasContainer;
