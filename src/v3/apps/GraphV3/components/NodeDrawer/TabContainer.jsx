import React from 'react';
import { useStoreState } from 'pullstate';
import { graphAppStore } from '../../stores/graphAppStore';
import { Scrollbars } from 'react-custom-scrollbars';
import normalizeWheel from 'normalize-wheel';
import PropTypes from 'prop-types';
import { baseTheme } from '../../../../../theme';

function TabContainer(props) {
  const { children } = props;
  const scrollRef = React.useRef();

  const openModals = useStoreState(graphAppStore, s => s.openModals);

  const themeObject = baseTheme.overrides.GraphAddMachineButton;
  return (
    <Scrollbars
      ref={scrollRef}
      style={{
        height: themeObject.width + themeObject.margin * 4,
        width: '100%'
      }}
    >
      <div
        onWheel={e => {
          if (scrollRef.current && openModals === 0) {
            const normalized = normalizeWheel(e);
            const ref = scrollRef.current;
            const currentLeft = ref.getScrollLeft() + normalized.pixelY;
            ref.scrollLeft(currentLeft);
          }
        }}
        style={{
          width: children.length * (themeObject.width + 2 * themeObject.margin)
        }}
      >
        {children}
      </div>
    </Scrollbars>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default TabContainer;
