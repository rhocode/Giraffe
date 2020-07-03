import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const STROKE_WIDTH = 40;
const DIV_HEIGHT = 20;

const styles = () => {
  return {
    fullscreen: {
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2D303D',
    },
    centerText: {
      height: DIV_HEIGHT,
      width: '100%',
      color: 'white',
      fontFamily: 'Roboto Mono, monospace',
    },
    loaderSpinner: {
      position: 'absolute',
      width: '100%',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
    },
    textContainer: {
      marginTop: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
    },
    stripeTop: {
      flexGrow: 0,
      height: 20,
      width: '200%',
      animation: `$topBar 0.5s linear infinite`,
    },
    stripeBottom: {
      height: 20,
      flexGrow: 0,
      width: '200%',
      animation: `$bottomBar 0.5s linear infinite`,
    },
    '@keyframes bottomBar': {
      '100%': {
        transform: `translateX(-${DIV_HEIGHT}px)`,
      },
      '0%': {
        transform: `translateX(-${DIV_HEIGHT + STROKE_WIDTH * Math.sqrt(2)}px)`,
      },
    },
    '@keyframes topBar': {
      '100%': {
        transform: `translateX(-${STROKE_WIDTH * Math.sqrt(2)}px)`,
      },
      '0%': {
        transform: `translateX(-${2 * STROKE_WIDTH * Math.sqrt(2)}px)`,
      },
    },
  };
};

function Stripe() {
  const strokeWidth = STROKE_WIDTH;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <pattern
          id="stripe"
          patternUnits="userSpaceOnUse"
          width={strokeWidth}
          height={strokeWidth}
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y="0"
            x2="0"
            y2={strokeWidth}
            stroke="#FF9800"
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stripe)" opacity="1" />
    </svg>
  );
}

function LoadingScreen(props) {
  const loading = [
    'Loading...',
    'Burning Coal...',
    'Deleting Steam Keys...',
    'Exploiting Resources...',
    'Petting Lizard Doggo...',
    'Adding Mana...',
    'Spilling Coffee...',
    'Drinking Coffee...',
    'Becoming A Goat...',
    'Charging Batteries...',
    'Reticulating Splines...',
    'Fueling Jetpack...',
  ];

  const { classes } = props;
  return (
    <div className={classes.fullscreen}>
      <div className={classes.loaderSpinner}>
        <div className={classes.stripeTop}>
          <Stripe />
        </div>
        <div className={classes.stripeBottom}>
          <Stripe />
        </div>
        <div className={classes.textContainer}>
          <div className={classes.centerText}>
            {loading[Math.floor(Math.random() * loading.length)]}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(LoadingScreen);
