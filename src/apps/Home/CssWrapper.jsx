import React, { Component } from 'react';

class CssWrapper extends Component {
  componentWillMount() {
    console.error('Added app.css here');
    require('./App.css');
  }

  render() {
    return <React.Fragment />;
  }
}

export default CssWrapper;
