import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import getLatestSchema from '../Graph/libraries/SGLib/utils/getLatestSchema';
import serialize from '../Graph/libraries/SGLib/algorithms/satisgraphtory/serialize';

const styles = theme => {
  return {
    container: {
      height: '100%',
      width: '100%',
      background: 'gray',
      display: 'flex'
    }
  };
};

const enums = ['Item', 'MachineClass', 'Recipe'];

const importEnumJSON = enm => {
  const data = require('../../proto/' + enm + '.json');
  const enums = data.nested.satisgraphtory.nested[enm].values;
  const reserved = data.nested.satisgraphtory.nested[enm].reserved;

  return {
    enums,
    reserved
  };
};

class DataApp extends Component {
  state = {
    data: null
  };

  componentDidMount() {
    const schema = getLatestSchema();
    serialize(schema, {});

    const stateData = {};

    enums.forEach(enm => {
      stateData[enm] = importEnumJSON(enm);
    });
    this.setState({
      data: stateData
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <pre>{JSON.stringify(this.state.data, null, 4)}</pre>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DataApp));
