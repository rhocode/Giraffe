import React from 'react';
import { connect } from 'react-redux';
import { setEditorData } from '../../../redux/actions/Data/dataActions';
import * as deep_diff from 'deep-diff';

function DiffUploader(props) {
  // Declare a new state variable, which we'll call "count"
  var lhs = {
    name: 'my object',
    description: "it's an object!",
    details: {
      it: 'has',
      an: 'array',
      with: ['a', 'few', 'elements']
    }
  };

  var rhs = {
    name: 'updated object',
    description: "it's an object!",
    details: {
      it: 'has',
      an: 'array',
      with: ['a', 'few', 'more', 'elements', { than: 'before' }]
    }
  };

  var differences = deep_diff.diff(lhs, rhs);
  console.error(differences);
  return <div />;
}

const mapStateToProps = (state, ownProps) => ({
  data: state.dataReducer[ownProps.objectName],
  data_original: state.dataReducer[ownProps.objectName + '_original'],
  MachineClass: state.dataReducer['MachineClass']
});

const mapDispatchToProps = dispatch => ({
  setData: data => dispatch(setEditorData(data))
});

export default React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DiffUploader)
);
