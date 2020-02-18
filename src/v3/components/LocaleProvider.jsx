import React from 'react';
import { getActiveLanguage, getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

export const LocaleContext = React.createContext({});

function LocaleProvider(props) {
  const { language, translate } = props;
  return (
    <LocaleContext.Provider value={{ language, translate }}>
      {props.children}
    </LocaleContext.Provider>
  );
}

const mapStateToProps = state => {
  return {
    language: getActiveLanguage(state.localize),
    translate: getTranslate(state.localize)
  };
};

export default connect(mapStateToProps)(LocaleProvider);
