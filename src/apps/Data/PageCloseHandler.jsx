import React from 'react';
import { connect } from 'react-redux';

function PageCloseHandler(props) {
  React.useEffect(() => {
    const handleBeforeUnload = event => {
      const check =
        props.Item === props.Item_original &&
        props.MachineClass === props.MachineClass_original &&
        props.Recipe === props.Recipe_original;

      console.error(check);

      if (!check) {
        event.preventDefault();
        event.returnValue = 'Do you really want to leave this page?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [
    props.Item,
    props.Item_original,
    props.MachineClass,
    props.MachineClass_original,
    props.Recipe,
    props.Recipe_original
  ]);

  return <div />;
}

const mapStateToProps = state => ({
  Item: state.dataReducer.Item,
  MachineClass: state.dataReducer.MachineClass,
  Recipe: state.dataReducer.Recipe,
  Item_original: state.dataReducer.Item_original,
  MachineClass_original: state.dataReducer.MachineClass_original,
  Recipe_original: state.dataReducer.Recipe_original
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageCloseHandler);
