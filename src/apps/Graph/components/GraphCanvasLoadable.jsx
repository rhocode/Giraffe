import Loadable from 'react-loadable';
import React, { useEffect } from 'react';
import AutoSizedLoadingWrapper from '../../../common/react/AutoSizedLoadingWrapper';
import { imageRepositoryPromise } from '../libraries/SGLib/repositories/imageRepository';
import deserialize from '../libraries/SGLib/algorithms/satisgraphtory/deserialize';
import { getTranslate } from 'react-localize-redux';
import {
  setGraphData,
  setInitialLoadedData
} from '../../../redux/actions/Graph/graphActions';
import { connect } from 'react-redux';
import { getPlaceableMachineClasses } from '../graphql/queries';

const FontFaceObserver = require('fontfaceobserver');

const LoadableComponent = Loadable({
  loader: () => {
    return Promise.all([
      new FontFaceObserver('Roboto Condensed').load(),
      ...imageRepositoryPromise.machines,
      ...imageRepositoryPromise.items,
      getPlaceableMachineClasses()
    ]).then(() => import('../libraries/SGLib/react/SatisGraphtoryCanvas'));
  },
  loading: AutoSizedLoadingWrapper
});

function GraphCanvasLoadable(props) {
  const { initialLoadedData, setInitialLoadedData } = props;
  useEffect(() => {
    if (initialLoadedData === null) {
      const secondary = {
        d:
          'UTJkM1NVRlNRVUZIUVVsblFVTm5RVTFCUVV0RVFXZEJSVUZGV1VGRFFVRkxRVUYzUVVKSlYwTkJRVlpCUlVScVVYZ3dRV2RIZUVSSlFrVnZRVVJCUVU5R2VFRkJVc1FnUlZaQlFVSjVVV2d3UVZGSlZrUkpRWFBHSUVoa3h5QkpWa0ZMUWtoU1FqQkJkMGxzUkVsQlRjWWdRemxCUVZFOVBRPT0=',
        i: 2,
        v: '0.1.0'
      };

      const deserialized = deserialize(secondary);
      setInitialLoadedData(deserialized);
    }
  }, [initialLoadedData, setInitialLoadedData]);

  return <LoadableComponent />;
}

function mapStateToProps(state) {
  return {
    translate: getTranslate(state.localize),
    initialLoadedData: state.graphReducer.initialLoadedData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGraphData: data => dispatch(setGraphData(data)),
    setInitialLoadedData: data => dispatch(setInitialLoadedData(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphCanvasLoadable);
