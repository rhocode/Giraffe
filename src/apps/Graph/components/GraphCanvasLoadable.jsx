import Loadable from "react-loadable";
import React from "react";
import LoadingBar from "../../../common/react/LoadingBar";
import {imageRepository} from "../libraries/SGLib/repositories/imageRepository";
const LoadableComponent = Loadable({
  loader: () => {
    const temp = imageRepository['constructor.png'];
    console.error(temp);
    return import('./GraphCanvas');
  },
  loading: LoadingBar,
});

export default class GraphCanvasLoadable extends React.Component {
  render() {
    return <LoadableComponent/>;
  }
}