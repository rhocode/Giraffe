import Loadable from "react-loadable";
import React from "react";
import LoadingBar from "../../../common/react/LoadingBar";
import { imageRepositoryPromise } from "../libraries/SGLib/repositories/imageRepository";

const FontFaceObserver = require("fontfaceobserver");

const LoadableComponent = Loadable({
  loader: () => {
    return Promise.all([
      new FontFaceObserver("Roboto Condensed").load(),
      ...imageRepositoryPromise.machines,
      ...imageRepositoryPromise.items
      // new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve(10);
      //   }, 1000)
      // })
    ]).then(() => import("../libraries/SGLib/react/SGCanvasRefactored"));
  },
  loading: LoadingBar
});

export default class GraphCanvasLoadable extends React.Component {
  render() {
    return <LoadableComponent />;
  }
}
