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

export default function Loading({ text, speed }) {
  const [count, setCount] = React.useState('');
  let interval = React.useRef(null);

  let memoizedCount = React.useMemo(() => count, [count]);

  React.useEffect(() => {
    interval.current = setInterval(() => {
      if (memoizedCount.length >= 3) {
        setCount('');
      } else {
        setCount((c) => c + '.');
      }
    }, speed);
    return () => clearInterval(interval.current);
  }, [count]);

  return <p style={styles.message}>{`${text}${count}`}</p>;
}

Loading.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number.isRequired
};

Loading.defaultProps = {
  text: 'Loading',
  speed: 300
};
