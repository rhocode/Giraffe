import React from 'react';
import { connect } from 'react-redux';

function PageCloseHandler(props) {
  React.useEffect(() => {
    const handleBeforeUnload = event => {
      const check =
        props.Item &&
        props.Item.rows.every(entry => !entry.local) &&
        props.MachineClass &&
        props.MachineClass.rows.every(entry => !entry.local) &&
        props.Recipe &&
        props.Recipe.rows.every(entry => !entry.local);

      console.error(check);

      if (!check) {
        event.preventDefault();
        return 'Are you sure to leave this page?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [props.Item, props.MachineClass, props.Recipe]);

  return <div />;
}

const mapStateToProps = state => ({
  Item: state.dataReducer.Item,
  MachineClass: state.dataReducer.MachineClass,
  Recipe: state.dataReducer.Recipe
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageCloseHandler);
