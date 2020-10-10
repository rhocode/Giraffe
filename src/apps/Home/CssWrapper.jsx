import React, { Component } from "react";

class CssWrapper extends Component {
  componentDidMount() {
    require("./App.css");
  }

  render() {
    return <React.Fragment />;
  }
}

export default CssWrapper;
