import { Component, PropTypes } from 'react';
import $ from 'jquery';

class WideScreenControl extends Component {
  static propTypes = {
    isWideScreen: PropTypes.bool
  };

  componentWillReceiveProps(nextProps) {
    this.triggerWideScreen(nextProps);
  }

  triggerWideScreen(nextProps = this.props) {
    const { isWideScreen } = nextProps;

    if (isWideScreen) {
      $('.page').css({
        width: 'calc(100% - 100px)',
        maxWidth: '5000px'
      });
      $('.neo_column.main').css({
        maxWidth: '999999px'
      });
    }
  }

  render() {
    return null;
  }
}

export default WideScreenControl;
