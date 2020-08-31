import React, { useCallback, useMemo, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import useDimensions from "../hooks/useDimensions";
import stringGen from "../../../../../utils/stringGen";
import { sgDevicePixelRatio } from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/canvasUtils";

const useStyles = makeStyles((theme) =>
  createStyles({
    canvasContainer: {
      display: "grid",
      gridArea: "contentArea",
      gridTemplateAreas: `"canvasElement"`,
      gridTemplateRows: "minmax(0, 1fr)",
      gridTemplateColumns: "1fr",
      minWidth: 0,
      minHeight: 0,
      position: "relative",
    },
    canvas: {
      gridArea: "canvasElement",
      minWidth: 0,
      minHeight: 0,
    },
  })
);

function SatisGraphtoryCanvas(props) {
  const classes = useStyles();
  const [ref, { height, width }] = useDimensions();
  const [, setCanvasCurrent] = useState(null);

  const ratio = sgDevicePixelRatio;
  const canvasId = useMemo(() => stringGen(10), []);

  const canvasRef = useCallback((node) => {
    setCanvasCurrent(node);
  }, []);

  const scaledHeight = (height || 1) * ratio;
  const scaledWidth = (width || 1) * ratio;
  return (
    <div ref={ref} className={classes.canvasContainer}>
      <canvas
        id={canvasId}
        className={classes.canvas}
        ref={canvasRef}
        height={scaledHeight}
        width={scaledWidth}
      />
      {props.children}
    </div>
  );
}

export default SatisGraphtoryCanvas;
