import React, { Component } from 'react';
import { stringGen } from 'v3/utils/stringUtils';

class InternalCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvasId = stringGen(10);
  }

  render() {
    return (
      <canvas
        style={{ display: 'block' }}
        id={this.canvasId}
        ref={this.props.reference}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

export default InternalCanvas;
