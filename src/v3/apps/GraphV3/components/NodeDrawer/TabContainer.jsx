import normalizeWheel from 'normalize-wheel';
import PropTypes from 'prop-types';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { baseTheme } from 'theme';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/GlobalGraphAppStoreProvider';

function TabContainer(props) {
  const { children } = props;
  const scrollRef = React.useRef();

  const { openModals } = React.useContext(PixiJSCanvasContext);

  const themeObject = baseTheme.overrides.GraphAddMachineButton;

  return (
    <Scrollbars
      ref={scrollRef}
      style={{
        height: themeObject.width + themeObject.margin * 4,
        width: '100%',
      }}
      onWheel={(e) => {
        if (scrollRef.current && openModals === 0) {
          const normalized = normalizeWheel(e);
          const ref = scrollRef.current;
          const currentLeft = ref.getScrollLeft() + normalized.pixelY;
          ref.scrollLeft(currentLeft);
        }
      }}
    >
      <div
        style={{
          width: children.length * (themeObject.width + 2 * themeObject.margin),
        }}
      >
        {children}
      </div>
    </Scrollbars>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TabContainer;
