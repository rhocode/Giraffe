import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const urlParams = new URLSearchParams(window.location.search);

  const whyDidIRender = urlParams.get('debugRender');
  if (whyDidIRender === '') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    whyDidYouRender(React, {
      trackAllPureComponents : true,
    });
  }
}
