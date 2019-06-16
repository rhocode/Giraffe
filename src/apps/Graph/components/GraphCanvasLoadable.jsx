import Loadable from "react-loadable";
import React from "react";
import LoadingBar from "../../../common/react/LoadingBar";
import {imageRepository} from "../libraries/SGLib/repositories/imageRepository";

const FontFaceObserver = require('fontfaceobserver');

const LoadableComponent = Loadable({
  loader: () => {
    return Promise.all([
      new FontFaceObserver('Roboto Condensed').load(),
      Promise.resolve(imageRepository),
      // new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve(10);
      //   }, 1000)
      // })
    ]).then(() => import('./GraphCanvas'));
  },
  loading: LoadingBar,
});

export default class GraphCanvasLoadable extends React.Component {

  render() {
    console.error("AAAAA")
    return <LoadableComponent/>;
  }
}