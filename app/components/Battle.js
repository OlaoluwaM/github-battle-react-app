import React from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from '../context/Theme';
import { Link } from 'react-router-dom';
import {
  FaUserFriends,
  FaFighterJet,
  FaTrophy,
  FaTimesCircle
} from 'react-icons/fa';

function Instructions() {
  const theme = React.useContext(ThemeContext);
  return (
    <div className='instructions-container'>
      <h1 className='center-text header-lg'>Instructions</h1>
      <ol className='container-sm grid center-text battle-instructions'>
        <li>
          <h3 className='header-sm'>Enter two Github users</h3>
          <FaUserFriends
            className={`bg-${theme}`}
            color='rgb(255, 191, 116)'
            size={140}
          />
        </li>
        <li>
          <h3 className='header-sm'>Battle</h3>
          <FaFighterJet className={`bg-${theme}`} color='#727272' size={140} />
        </li>
        <li>
          <h3 className='header-sm'>See the winners</h3>
          <FaTrophy
            className={`bg-${theme}`}
            color='rgb(255, 215, 0)'
            size={140}
          />
        </li>
      </ol>
    </div>
  );
}

function PlayerInput({ label, onSubmit }) {
  const [username, setUsername] = React.useState('');
  const theme = React.useContext(ThemeContext);

  const handleInput = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.info('Submitted');
    onSubmit(username);
  };

  return (
    <form className='column player' onSubmit={handleSubmit}>
      <label htmlFor='username' className='player-label'>
        {label}
      </label>
      <div className='row player-inputs'>
        <input
          id='username'
          className={`input-${theme}`}
          placeholder='github username'
          autoComplete='off'
          value={username}
          onChange={handleInput}
        />
        <button
          className={`btn ${theme === 'light' ? 'dark' : 'light'}-btn`}
          type='submit'
          disabled={!username}>
          Submit
        </button>
      </div>
    </form>
  );
}

PlayerInput.propTypes = {
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};

function PlayerPreview({ label, onReset, username }) {
  const theme = React.useContext(ThemeContext);

  return (
    <div className='column player'>
      <h3 className='player-label'>{label}</h3>
      <div className={`row bg-${theme}`}>
        <div className='player-info'>
          <img
            className='avatar-sm'
            src={`https://github.com/${username}.png?size=200`}
            alt={`Avatar for ${username}`}
          />
          <a href={`https://github.com/${username}`} className='link'>
            {username}
          </a>
        </div>
        <button
          style={{
            paddingRight: '30px',
            cursor: 'pointer',
            outline: 'none'
          }}
          className='btn-clear flex-center'
          onClick={onReset}>
          <FaTimesCircle color='rgb(194, 57, 42)' size={26} />
        </button>
      </div>
    </div>
  );
}

PlayerPreview.propTypes = {
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default function Battle() {
  const [playerOne, setPlayerOne] = React.useState(null);
  const [playerTwo, setPlayerTwo] = React.useState(null);

  const updatePlayers = (label, value) => {
    if (label === 'playerOne') {
      setPlayerOne(value);
    } else {
      setPlayerTwo(value);
    }
  };

  return (
    <React.Fragment>
      <Instructions />
      <div className='players-container'>
        <h1 className='center-text header-lg'>Players</h1>
        <div className='row space-around'>
          {playerOne === null ? (
            <PlayerInput
              label='Player One'
              onSubmit={(value) => updatePlayers('playerOne', value)}
            />
          ) : (
            <PlayerPreview
              username={playerOne}
              label='Player One'
              onReset={() => updatePlayers('playerOne', null)}
            />
          )}
          {playerTwo === null ? (
            <PlayerInput
              label='Player Two'
              onSubmit={(value) => updatePlayers('playerTwo', value)}
            />
          ) : (
            <PlayerPreview
              username={playerTwo}
              label='Player Two'
              onReset={() => updatePlayers('playerTwo', null)}
            />
          )}
        </div>
        {playerOne && playerTwo && (
          <Link
            className='btn dark-btn btn-space'
            to={{
              pathname: '/battle/results',
              search: `?playerOne=${playerOne}&playerTwo=${playerTwo}`
            }}>
            Battle
          </Link>
        )}
      </div>
    </React.Fragment>
  );
}
