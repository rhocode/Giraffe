import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';

const styles = theme => ({
  fullscreen: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2D303D'
  },
  centerText: {
    color: 'white',
    marginTop: '10em',
    fontFamily: 'Roboto Mono, monospace'
  },
  loaderSpinner: {
    position: 'absolute',
    width: '100%',
    top: '50%',
    overflowX: 'hidden'
  },
  stripe: {
    height: 40,
    width: '200%',
    backgroundImage: 'repeating-linear-gradient(-45deg,#FF9800,#FF9800 20px,#333 20px,#333 40px)',
  }
});

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
    'Fueling Jetpack...'
  ];

  const { classes } = props;
  return (
    <div className={classes.fullscreen}>
      <div className={classes.loaderSpinner}>
        <motion.div
          animate={{
            translateX: [-70, -13],
          }}
          transition= {{
            loop: Infinity
          }}
        >
          <div className={classes.stripe}></div>
        </motion.div>
      </div>
      <div className={classes.centerText}>
        {loading[Math.floor(Math.random() * loading.length)]}
      </div>
    </div>
  );
}

export default withStyles(styles)(LoadingScreen);
