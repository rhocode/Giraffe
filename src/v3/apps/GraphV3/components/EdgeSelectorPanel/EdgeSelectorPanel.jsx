import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import FastForwardIcon from '@material-ui/icons/FastForward';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      bottom: '2em',
      left: '2em',
      position: 'absolute',
      width: 340,
      minHeight: 100,
      zIndex: theme.zIndex.drawer + 1,
      pointerEvents: 'auto',
      flexDirection: 'column',
      flexGrow: 1,
    },
    title: {
      fontSize: 14,
    },
    type: {
      paddingBottom: 10,
      marginBottom: 10,
    },
    buttons: {
      paddingTop: 10,
      marginTop: 10,
    },
    buttonText: {
      width: 700,
    },
  };
});

function EdgeSelectorPanel() {
  const classes = useStyles();

  // const handleChange = (event) => {
  // };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Selector Settings
        </Typography>
        <div classname={classes.type}>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              // value={}
              // onChange={handleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={classes.buttons}>
          <ButtonGroup fullWidth>
            <Button color="secondary" className={classes.iconButton}>
              <FastRewindIcon />
            </Button>
            <Button color="secondary" className={classes.iconButton}>
              <RemoveIcon />
            </Button>
            <Button
              disableRipple
              disableFocusRipple
              disableTouchRipple
              className={classes.buttonText}
            >
              Mark 1
            </Button>
            <Button color="primary" className={classes.iconButton}>
              <AddIcon />
            </Button>
            <Button color="primary" className={classes.iconButton}>
              <FastForwardIcon />
            </Button>
          </ButtonGroup>
        </div>
      </CardContent>
    </Card>
  );
}

export default EdgeSelectorPanel;
