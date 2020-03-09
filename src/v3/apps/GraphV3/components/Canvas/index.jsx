import React, { Suspense } from 'react';
import AutoSizedLoadingWrapper from '../../../../../common/react/AutoSizedLoadingWrapper';
// import { graphAppStore } from '../../stores/graphAppStore';
// import { useStoreState } from 'pullstate';

const FontFaceObserver = require('fontfaceobserver');

const InnerComponent = React.lazy(() => {
  return Promise.all([
    new FontFaceObserver('Roboto Condensed').load(),
    new FontFaceObserver('Bebas Neue').load()
  ]).then(() =>
    import('../../libraries/SatisGraphtoryLib/react/SatisGraphtoryCanvas')
  );
});

const LoadableComponent = props => {
  return (
    <Suspense fallback={<AutoSizedLoadingWrapper />}>
      <InnerComponent {...props} />
    </Suspense>
  );
};

function Canvas(props) {
  // const initialLoadedData = useStoreState(
  //   graphAppStore,
  //   s => s.initialLoadedData
  // );

  // useEffect(() => {
  //   if (initialLoadedData === null) {
  //     const secondary = {
  //       d:
  //         'UTJkM1NVRlNRVUZIUVVsblFVTm5RVTFCUVV0RVFXZEJSVUZGV1VGRFFVRkxRVUYzUVVKSlYwTkJRVlpCUlVScVVYZ3dRV2RIZUVSSlFrVnZRVVJCUVU5R2VFRkJVc1FnUlZaQlFVSjVVV2d3UVZGSlZrUkpRWFBHSUVoa3h5QkpWa0ZMUWtoU1FqQkJkMGxzUkVsQlRjWWdRemxCUVZFOVBRPT0=',
  //       i: 2,
  //       v: '0.1.0'
  //     };
  //
  //     const deserialized = deserialize(secondary);
  //     graphAppStore.update(s => {
  //       s.initialLoadedData = deserialized;
  //     });
  //   }
  // }, [initialLoadedData]);

  return <LoadableComponent {...props} />;
}

export default Canvas;
