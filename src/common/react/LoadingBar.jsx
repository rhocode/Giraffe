import React, {useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { stringGen } from '../../apps/Graph/libraries/SGLib/utils/stringUtils';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import PropTypes from "prop-types";

const styles = () => ({
  canvasContainer: {
    overflow: "hidden",
    display: "grid",
    gridTemplateAreas:
      `"spacerTop"
       "loader"
       "spacerBottom"`,
    gridTemplateRows: "minmax(0, 1fr) min-content minmax(0, 1fr)",
    gridTemplateColumns: "minmax(0, 1fr)",
  },
  canvas: {
    gridArea: 'loader',
  },
});

function useBoundingBoxRect(props) {
  const [rect, setRect] = useState({
    width: 0,
    height: 0
  });

  const [canvasContainerCurrent, setCanvasContainerCurrent] = useState(null);
  const [canvasCurrent, setCanvasCurrent] = useState(null);

  const ref = useCallback((node => {
    setCanvasContainerCurrent(node);
  }), []);

  const canvasRef = useCallback((node => {
    setCanvasCurrent(node);
  }), []);

  const {heightOverride, widthOverride} = props;

  useEffect(() => {
    function measureElement() {
      if (canvasContainerCurrent) {
        const boundingRect = canvasContainerCurrent.getBoundingClientRect();
        if (canvasCurrent) {
          canvasCurrent.style.width = Math.round(widthOverride || rect.width) + 'px';
          canvasCurrent.style.height =  Math.round(heightOverride || rect.height) + 'px';
        }
        if (boundingRect.width !== rect.width || boundingRect.height !== rect.height ) {
          setRect(boundingRect);
        }
      }
    }
    measureElement();
    window.addEventListener('resize', measureElement, false);
    return () => window.removeEventListener('resize', measureElement, false);
  }, [rect, canvasCurrent, canvasContainerCurrent, heightOverride, widthOverride]);

  const canvasContext = canvasCurrent ? canvasCurrent.getContext('2d') : null;

  return [rect, ref, canvasRef, canvasContext];
}

const useAnimationFrame = callback => {
  const callbackRef = useRef(callback);
  useLayoutEffect (
    () => {
      callbackRef.current = callback;
    },
    [callback]
  );

  const frameRef = useRef();
  useLayoutEffect(() => {
    const loop = () => {
      frameRef.current = requestAnimationFrame(
        loop
      );
      const cb = callbackRef.current;
      cb();
    };

    frameRef.current = requestAnimationFrame(
      loop
    );
    return () =>
      cancelAnimationFrame(frameRef.current);
  }, []);
};

function drawRhombus(context, xTop, yTop, rhombusHeight, rhombusWidth) {
  context.fillStyle = '#FF9800';
  context.beginPath();
  context.moveTo(xTop, yTop);
  context.lineTo(xTop + rhombusWidth / 2, yTop);
  context.lineTo(xTop + rhombusWidth, yTop + rhombusHeight);
  context.lineTo(xTop + rhombusWidth / 2, yTop + rhombusHeight);
  context.closePath();
  context.fill();
}

const LoadingCanvas = (props) => {
  const canvasId = useMemo(() => stringGen(10), []);
  const [rect, ref, canvasRef, canvasContext] = useBoundingBoxRect(props);
  const ratio =  window.devicePixelRatio || 1;
  const {heightOverride, widthOverride} = props;

  const [loadingText, setLoadingText] = useState(props.translate('loadingText_message0'));
  const [offset, setOffset] = useState(0);

  const usedHeight = heightOverride || rect.height;
  const usedWidth = widthOverride || rect.width;

  useAnimationFrame(() => {
    if (!canvasContext)
      return;

    canvasContext.save();
    canvasContext.scale(ratio, ratio);

    const width = usedWidth;

    const rhombusHeight = 50;
    const rhombusWidth = 100;
    const numberOfRhombus = width / rhombusWidth + 2;
    const loadingTextLength = 12;

    setOffset((offset - 1) % rhombusWidth);

    const starting = offset - rhombusWidth;
    canvasContext.clearRect(0, 0, usedWidth, usedHeight);
      //
      for (let i = 0; i < numberOfRhombus; i++) {
        drawRhombus(
          canvasContext,
          starting + i * rhombusWidth,
          0,
          rhombusHeight,
          rhombusWidth
        );
      }
      //
      if (props.loadingText) {
        canvasContext.textBaseline = 'middle';
        canvasContext.textAlign = 'center';
        canvasContext.font = '20px monospace';
        canvasContext.fillStyle = 'white';
        if (!(offset % 15)) {
          const rand = Math.floor(Math.random() * loadingTextLength);
          setLoadingText(props.translate('loadingText_message' + rand));
        }

        canvasContext.fillText(loadingText, parseInt(`${width / 2}`), parseInt(`${rhombusHeight + 30}`));
      }

      canvasContext.restore();
    }
  );

  return (
    <div ref={ref}  className={props.classes.canvasContainer} style={{overflow: 'hidden'}}>
      <canvas
        id={canvasId}
        className={props.classes.canvas}
        ref={canvasRef}
        height={(usedHeight) * ratio}
        width={(usedWidth) * ratio}
      />
    </div>
  )
};

LoadingCanvas.propTypes = {
  loadingText: PropTypes.bool
};

const mapStateToProps = state => ({
  translate: getTranslate(state.localize)
});

export default connect(mapStateToProps)(withStyles(styles)(LoadingCanvas));