import React from 'react';

export default function AsyncComponent(importComponentInput) {
  // const importComponent = import(importComponentInput);

  // class AsyncComponentInner extends Component {
  //   constructor(props) {
  //     super(props);
  //
  //     this.state = {
  //       component: null
  //     };
  //   }
  //
  //   async componentDidMount() {
  //     const { default: component } = await importComponent();
  //
  //     this.setState({
  //       component: component
  //     });
  //   }
  //
  //   render() {
  //     const C = this.state.component;
  //
  //     return C ? <C {...this.props} /> : null;
  //   }
  // }

  return React.lazy(() => importComponentInput);
}
