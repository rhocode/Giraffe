import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import useDimensions from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/hooks/useDimensions';
import { Stage } from '@inlet/react-pixi';
import BunnyComponent from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/BunnyComponent';

const useStyles = makeStyles((theme) =>
  createStyles({
    canvasContainer: {
      display: 'grid',
      gridArea: 'canvasArea',
      gridTemplateAreas: `"canvasElement"`,
      gridTemplateRows: 'minmax(0, 1fr)',
      gridTemplateColumns: '1fr',
      minWidth: 0,
      minHeight: 0,
      position: 'relative',
    },
    canvas: {
      gridArea: 'canvasElement',
      minWidth: 0,
      minHeight: 0,
    },
  })
);

function PixiJSCanvas(props) {
  const classes = useStyles();
  const [ref, { height, width }] = useDimensions();

  return (
    <div ref={ref} className={classes.canvasContainer}>
      <Stage width={width} height={height} options={{ transparent: true }}>
        <BunnyComponent x={width / 2} y={width / 2} />
      </Stage>
      {props.children}
    </div>
  );
}

export default PixiJSCanvas;
