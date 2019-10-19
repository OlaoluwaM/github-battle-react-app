import React from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from '../context/Theme';

export default function Card({
  header,
  avatar,
  subheading,
  href,
  name,
  children
}) {
  const theme = React.useContext(ThemeContext);
  return (
    <div className={`card bg-${theme}`}>
      <h4 className='header-lg center-text'>{header}</h4>
      <img className='avatar' src={avatar} alt={`Avatar for ${name}`} />
      {subheading && <h4 className='center-text'>{subheading}</h4>}
      <h2 className='center-text'>
        <a className='link' href={href}>
          {name}
        </a>
      </h2>
      {children}
    </div>
  );
}

Card.propTypes = {
  header: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  subheading: PropTypes.string,
  href: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
