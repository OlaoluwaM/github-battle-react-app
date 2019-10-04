import React from 'react';
import PropTypes from 'prop-types';
import { ThemeConsumer } from '../context/Theme';
import { Link } from 'react-router-dom';
import {
  FaUserFriends,
  FaFighterJet,
  FaTrophy,
  FaTimesCircle
} from 'react-icons/fa';

function Instructions() {
  return (
    <ThemeConsumer>
      {({ theme }) => (
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
              <FaFighterJet
                className={`bg-${theme}`}
                color='#727272'
                size={140}
              />
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
      )}
    </ThemeConsumer>
  );
}

class PlayerInput extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired
  };
  state = {
    username: ''
  };

  handleInput = (e) => {
    this.setState({
      username: e.target.value
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    console.info('Submitted');
    this.props.onSubmit(this.state.username);
  };
  render() {
    const { username: input } = this.state;
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <form className='column player' onSubmit={this.handleSubmit}>
            <label htmlFor='username' className='player-label'>
              {this.props.label}
            </label>
            <div className='row player-inputs'>
              <input
                id='username'
                className={`input-${theme}`}
                placeholder='github username'
                autoComplete='off'
                value={input}
                onChange={this.handleInput}
              />
              <button
                className={`btn ${theme === 'light' ? 'dark' : 'light'}-btn`}
                type='submit'
                disabled={!input}>
                Submit
              </button>
            </div>
          </form>
        )}
      </ThemeConsumer>
    );
  }
}

class PlayerPreview extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    onReset: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
  };
  render() {
    const { label, onReset, username } = this.props;
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <div className='column player'>
            <h3 className='player-label'>{label}</h3>
            <div className={`row bg-${theme} `}>
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
        )}
      </ThemeConsumer>
    );
  }
}

export default class Battle extends React.Component {
  state = {
    playerOne: null,
    playerTwo: null
  };

  updatePlayers = (label, value) => {
    this.setState({
      [label]: value
    });
  };
  handleReset = (id) => {
    this.setState({
      [id]: null
    });
  };
  render() {
    const { playerOne, playerTwo } = this.state;

    return (
      <React.Fragment>
        <Instructions />
        <div className='players-container'>
          <h1 className='center-text header-lg'>Players</h1>
          <div className='row space-around'>
            {playerOne === null ? (
              <PlayerInput
                label='Player One'
                onSubmit={(value) => this.updatePlayers('playerOne', value)}
              />
            ) : (
              <PlayerPreview
                username={playerOne}
                label='Player One'
                onReset={() => this.handleReset('playerOne')}
              />
            )}
            {playerTwo === null ? (
              <PlayerInput
                label='Player Two'
                onSubmit={(value) => this.updatePlayers('playerTwo', value)}
              />
            ) : (
              <PlayerPreview
                username={playerTwo}
                label='Player Two'
                onReset={() => this.handleReset('playerTwo')}
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
}
