import React from 'react';
import HelpIcon from '@material-ui/icons/Help';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import IconDialog from './IconDialog';
import { withStyles } from '@material-ui/core';

const styles = theme => ({});

function HelpButton(props) {
  return (
    <IconDialog label="Help" icon={<HelpIcon />}>
      <Typography variant="h4">Welcome to SatisGraphtory!</Typography>
      <Typography variant="body1">
        This is a factory planner/optimizer/analyzer tool for factories old and
        new, meant to accompany the game Satisfactory by Coffee Stain Studios.{' '}
      </Typography>
      <br />
      <Typography variant="body1">
        We are looking for more developers! If you know React, reach out to us
        on our{' '}
        <Link
          href={'https://discord.gg/ZRpcgqY'}
          target="_blank"
          rel="noopener"
          color="secondary"
        >
          Discord server
        </Link>
        !
      </Typography>
      <Typography variant="body1">
        Thanks for checking out our tool! If you have any questions,
        suggestions, feedback,{' '}
        <Link
          href={'https://discord.gg/ZRpcgqY'}
          target="_blank"
          rel="noopener"
          color="secondary"
        >
          join our community
        </Link>
        ! Follow us on Twitter or DM us{' '}
        <Link
          href={'https://twitter.com/satisgraphtory'}
          target="_blank"
          rel="noopener"
          color="secondary"
        >
          @satisgraphtory
        </Link>
        !
      </Typography>
      <br />
      <Typography variant="h5">This tool will always be free.</Typography>
      <br />
      <Typography variant="h5">Graph Basics</Typography>
      <ul>
        <Typography variant="body1">
          <li>
            Use the <b>Add menu</b> to <b>add</b> machines to the diagram
          </li>
        </Typography>
        <Typography variant="body1">
          <li>
            <b>CLICK</b> on a node/path to <b>select</b> it
          </li>
        </Typography>
        <Typography variant="body1">
          <li>
            Press <b>BACKSPACE</b> on a selected node/path to delete it
          </li>
        </Typography>
        <Typography variant="body1">
          <li>
            Hold down <b>SHIFT</b> and <b>drag</b> from node to node to create
            belts
          </li>
        </Typography>
        <Typography variant="body1">
          <li>
            Use <b>MOUSE SCROLL</b> to control overclock (black text in the
            white circle)
          </li>
        </Typography>
      </ul>
      <Typography variant="h5">Sharing</Typography>
      <Typography variant="body1">
        Generate a share code by using the Share button in the top right.
      </Typography>
      <br />
      <Typography variant="h5">Legend</Typography>
      <Typography variant="body1">
        <span style={{ color: 'orange' }}>Orange</span> numbers means the
        machine wastes time doing nothing.
      </Typography>
      <Typography variant="body1">
        <span style={{ color: 'LightCoral' }}>Red</span> numbers means the
        machine isn't processing fast enough.
      </Typography>
      <Typography variant="body1">
        <span style={{ color: 'Blue' }}>Blue</span> numbers means the belt
        capacity was overridden (and you need to fix it ASAP!)
      </Typography>
      <br />
      <Typography variant="h5">About/Disclaimers</Typography>
      {/*<Typography variant="body1">Special thanks to the following testers: GeekyMeerkat, Stay, HartWeed, safken, marcspc, Laugexd</Typography>*/}
      <Typography variant="body1">
        Created by{' '}
        <Link
          href="https://github.com/tehalexf"
          target="_blank"
          rel="noopener"
          color="secondary"
        >
          Alex
        </Link>{' '}
        (
        <Link
          href="https://twitter.com/tehalexf"
          target="_blank"
          rel="noopener"
          color="secondary"
        >
          @tehalexf
        </Link>
        ) and{' '}
        <Link
          href="https://github.com/thinkaliker"
          target="_blank"
          rel="noopener"
          color="secondary"
        >
          Adam
        </Link>{' '}
        (
        <Link
          href="https://twitter.com/thinkaliker"
          target="_blank"
          rel="noopener"
          color="secondary"
        >
          @thinkaliker
        </Link>
        ).
      </Typography>
      <Typography>
        Additional thanks goes out to our SatisGraphtory Discord community, for
        providing input, feedback, code, and being general guinea pigs.
      </Typography>
      <Typography variant="body1">
        Not officially affiliated with Satisfactory, Coffee Stain Studios AB, or
        THQ Nordic AB.
      </Typography>
      <Typography variant="body1">
        Images sourced from the Satisfactory Wiki, which is sourced from Coffee
        Stain Studios AB's Satisfactory.
      </Typography>
      <br />
      <Typography variant="body1">
        Revisit these instructions anytime by clicking on the <b>?</b> in the
        top right.
      </Typography>
    </IconDialog>
  );
}

export default withStyles(styles)(HelpButton);
