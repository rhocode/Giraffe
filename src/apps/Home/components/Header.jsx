import * as React from 'react';

import './Header.css';
import { throttle } from 'throttle-debounce';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showHeader: false };
  }

  handleScroll = () => {
    const showHeader = document.scrollingElement
      ? document.scrollingElement.scrollTop > 50
      : true;
    this.setState({ showHeader });
  };
  throttledScroll = throttle(100, this.handleScroll);

  componentDidMount() {
    document.addEventListener('scroll', this.throttledScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.throttledScroll);
  }

  render() {
    return (
      <header className={'Header' + (this.state.showHeader ? '' : ' alt')}>
        {this.props.children}
      </header>
    );
  }
}

export default Header;
