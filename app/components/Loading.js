import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  message: {
    fontSize: '35px',
    position: 'absolute',
    left: '0',
    right: '0',
    marginTop: '20px',
    textAlign: 'center'
  }
};

export default class Loading extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired
  };
  static defaultProps = {
    text: 'Loading',
    speed: 250
  };
  state = {
    message: this.props.text
  };
  componentDidMount() {
    const { text, speed } = this.props;
    this.interval = setInterval(() => {
      this.state.message === text + '...'
        ? this.setState({
            message: text
          })
        : this.setState(({ message }) => ({
            message: message + '.'
          }));
    }, speed);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const { message } = this.state;
    return <p style={styles.message}>{message}</p>;
  }
}
