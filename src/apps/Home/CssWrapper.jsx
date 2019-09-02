import React, { Component } from 'react';

class CssWrapper extends Component {
  componentWillMount() {
    require('./App.css');
  }

  render() {
    return <React.Fragment />;
  }
}

export default CssWrapper;
