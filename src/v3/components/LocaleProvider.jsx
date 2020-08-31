import React from "react";
import { getActiveLanguage, getTranslate } from "react-localize-redux";
import { connect } from "react-redux";

export const LocaleContext = React.createContext({
  language: null,
  translate: (a) => a,
});

function LocaleProvider(props) {
  const { localize } = props;

  const [languageValue, setLanguageValue] = React.useState(
    getActiveLanguage(localize)
  );

  React.useEffect(() => {
    setLanguageValue(getActiveLanguage(localize));
  }, [localize]);

  const translateFunction = React.useCallback(() => {
    return getTranslate(localize);
  }, [localize]);

  return (
    <LocaleContext.Provider
      value={{ language: languageValue, translate: translateFunction() }}
    >
      {props.children}
    </LocaleContext.Provider>
  );
}

const mapStateToProps = (state) => {
  return {
    localize: state.localize,
  };
};

export default connect(mapStateToProps)(LocaleProvider);
