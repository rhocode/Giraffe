import React from 'react';
import HelpIcon from '@material-ui/icons/Help';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import IconDialog from './IconDialog';
import { withStyles } from '@material-ui/core';

const styles = (theme) => ({});

function HelpButton(props) {
  return (
    <IconDialog label="Help" icon={<HelpIcon />}>
      <Typography variant="h4">Welcome to SatisGraphtory!</Typography>
      <Typography variant="body1">
        This is a factory planner/optimizer/analyzer tool for factories old and
        new, meant to accompany the game Satisfactory by Coffee Stain Studios.{' '}
      </Typography>
      <br />
      <Typography variant="h5">This tool will always be free.</Typography>
      <br />
      <Typography variant="h5">Graph Basics</Typography>

      <Typography variant="body1">
        <ul>
          <li>
            In any mode, <b>SCROLL</b> to zoom in and out
          </li>
        </ul>
      </Typography>

      <Typography variant="body1">
        <ul>
          <li>
            Use the <b>Move</b> button in the toolbar to enter <b>Move</b> mode
          </li>
          <li>
            While in <b>Move</b> mode, <b>CLICK</b> on the background in order
            to <b>pan</b> around your diagram
          </li>
          <li>
            While in <b>Move</b> mode, <b>CLICK</b> on a node to <b>move</b> it
          </li>
        </ul>
      </Typography>

      <Typography variant="body1">
        <ul>
          <li>
            Use the <b>Select</b> button in the toolbar to enter <b>Select</b>{' '}
            mode
          </li>
          <li>
            While in <b>Select</b> mode, <b>CLICK</b> on nodes/edges to bring up
            their properties
          </li>
          <li>
            While in <b>Select</b> mode, <b>CLICK AND DRAG</b> on the background
            to perform a multi-select
          </li>
          <li>
            While in <b>Select</b> mode, hold <b>Shift</b> to quickly switch
            back to <b>Move</b> mode in order to pan
          </li>
          {/* <li>
            While in <b>Select</b> mode, press the <b>Delete</b> key to delete the selection
          </li> */}
        </ul>
      </Typography>

      <Typography variant="body1">
        <ul>
          <li>
            Use the <b>Add</b> button in the toolbar to enter <b>Add</b> mode
          </li>
          <li>
            While in <b>Add</b> mode, use the bottom panel to select your
            machine type, and select a recipe. <b>CLICK</b> anywhere on the
            canvas in order to add the machine
          </li>
          {/* <li>
            While in <b>Add</b> mode, use the bottom panel to select a recipe for generation, and click on the graph to add a full resource chain
          </li> */}
        </ul>
      </Typography>

      <Typography variant="body1">
        <ul>
          <li>
            Use the <b>Link</b> button in the toolbar to enter <b>Link</b> mode
          </li>
          <li>
            while in <b>Link</b> mode, the nodes on the canvas will grey out
            nodes already fully connected, while available nodes will stay lit
            up
          </li>
          <li>
            While in <b>Link</b> mode, <b>CLICK</b> the first node you would
            like to start the connection at and <b>CLICK</b> the second node you
            would like to end the connection at
          </li>
        </ul>
      </Typography>

      <Typography variant="h5">Saving</Typography>
      <Typography variant="body1">
        By default, the app will save files to your local browser, and NO data
        will be saved to the cloud. You have the ability to create and save
        multiple graphs locally. If you wish to utilize cloud saving, you will
        need a <b>Google</b> account in order to utilize <b>Google Drive</b> as
        a backup solution.
      </Typography>
      <Typography variant="body1">
        If using the cloud features, you will need to upload your local copy
        manually initially. Afterwards, you will need to periodically push your
        changes back to the cloud.
      </Typography>
      <br />

      <Typography variant="h5">Sharing</Typography>
      <Typography variant="body1">
        You <b>MUST</b> be signed into <b>Google</b> in order to create a
        sharing link. Once signed in, you must set the current file to{' '}
        <b>Shareable</b> in order to get a shareable link. By default, graphs
        will be private - only you will be able to see and edit graphs in your
        account.
      </Typography>
      <Typography variant="body1">
        You can still use the <b>Export to file</b> function and share that
        file, utilizing the <b>Import from file</b> feature in order to load it
        back into the app.
      </Typography>
      {/* <Typography variant="h5">Legend</Typography>
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
      </Typography> */}
      <br />
      <Typography variant="h5">About/Disclaimers</Typography>
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
          href={'https://reddit.com/r/satisgraphtory'}
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
      <br />

      <Typography variant="body1">
        Additional thanks goes out to our SatisGraphtory Discord community, for
        providing input, feedback, code, and being general guinea pigs.
      </Typography>
      <br />

      <Typography variant="body1">
        Not officially affiliated with Satisfactory, Coffee Stain Studios AB, or
        THQ Nordic AB.
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
