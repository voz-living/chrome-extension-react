import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

class WideScreenControl extends Component {
  static propTypes = {
    isWideScreen: PropTypes.bool,
  }

  componentDidMount() {
    this.triggerWideScreen();
  }

  componentWillReceiveProps(nextProps) {
    this.triggerWideScreen(nextProps);
  }

  triggerWideScreen(nextProps = this.props) {
    const { isWideScreen } = nextProps;

    if (isWideScreen) {
      $('.page').css({
        width: '100%',
        maxWidth: '5000px',
      });
    }
  }

  render() { return null; }
}

const mapStateToProps = state => {
  const { isWideScreen } = state.vozLiving;

  return {
    isWideScreen,
  };
};

export default connect(mapStateToProps)(WideScreenControl);
