import { Component, PropTypes } from 'react';
import $ from 'jquery';

class WideScreenControl extends Component {
  static propTypes = {
    isWideScreen: PropTypes.bool,
  }

  componentWillReceiveProps(nextProps) {
    this.triggerWideScreen(nextProps);
  }

  triggerWideScreen(nextProps = this.props) {
    const { isWideScreen } = nextProps;

    // if (isWideScreen) {
    //   $('.page').css({
    //     width: '100%',
    //     maxWidth: '5000px',
    //   });
    // }
  }

  render() { return null; }
}

export default WideScreenControl;
