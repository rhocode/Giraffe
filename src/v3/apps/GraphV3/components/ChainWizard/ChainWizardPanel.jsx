import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import WifiIcon from '@material-ui/icons/Wifi';
import BluetoothIcon from '@material-ui/icons/Bluetooth';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: theme.overrides.GraphDrawer.width * 1.5,
    marginTop: theme.overrides.GraphAppBar.height,
  },
  drawerContent: {
    padding: 20,
  },
}));

function ChainWizardPanel() {
  const classes = useStyles();

  return (
    <Drawer
      variant="temporary"
      anchor={'left'}
      // open={drawerOpen}
      open={true}
      // onClose={() => setDrawerOpen(false)}
      classes={{
        paper: classes.drawer,
      }}
    >
      <List
        subheader={<ListSubheader disableSticky>Settings</ListSubheader>}
        className={classes.root}
      >
        <ListItem>
          <ListItemIcon>
            <WifiIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-wifi" primary="Wi-Fi" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>{' '}
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={true}
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default ChainWizardPanel;
