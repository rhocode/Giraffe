import Loadable from 'react-loadable';
import React from 'react';
import LoadingBar from '../../../common/react/LoadingBar';
import { imageRepositoryPromise } from '../libraries/SGLib/repositories/imageRepository';

const FontFaceObserver = require('fontfaceobserver');

const LoadableComponent = Loadable({
  loader: () => {
    return Promise.all([
      new FontFaceObserver('Roboto Condensed').load(),
      ...imageRepositoryPromise.machines,
      ...imageRepositoryPromise.items
    ]).then(() => import('../libraries/SGLib/react/SatisGraphtoryCanvas'));
  },
  loading: LoadingBar
});

export default class GraphCanvasLoadable extends React.Component {
  render() {
    return <LoadableComponent />;
  }
}
