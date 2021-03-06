import React from 'react';
import { ThemeContext } from '../context/Theme';
import { NavLink } from 'react-router-dom';

const activeStyle = {
  color: 'rgb(187, 46, 31)'
};

export default function NavBar({ toggleTheme }) {
  const theme = React.useContext(ThemeContext);
  return (
    <nav className='row space-between'>
      <ul className='row nav'>
        <li>
          <NavLink exact to='/' activeStyle={activeStyle} className='nav-link'>
            Popular
          </NavLink>
        </li>
        <li>
          <NavLink to='/battle' activeStyle={activeStyle} className='nav-link'>
            Battle
          </NavLink>
        </li>
      </ul>
      <button
        style={{ fontSize: 30, outline: 'none', cursor: 'pointer' }}
        className='btn-clear'
        onClick={toggleTheme}>
        {theme === 'light' ? '🔦' : '💡'}
      </button>
    </nav>
  );
}
