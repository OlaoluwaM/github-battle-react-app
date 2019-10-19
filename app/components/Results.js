import React from 'react';
import { battle } from '../utils/api';
import Card from './Card';
import Loading from './Loading';
import ToolTips from './Tooltips';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import {
  FaCompass,
  FaBriefcase,
  FaUsers,
  FaUserFriends,
  FaCode,
  FaUser
} from 'react-icons/fa';

function ProfileList({ player }) {
  return (
    <ul className='card-list'>
      <li key={player.name}>
        <FaUser color='rgb(239, 115, 115)' size={22} />
        {player.name}
      </li>
      {player.location && (
        <li key={player.location}>
          <ToolTips text="User's Location">
            <FaCompass color='rgb(144, 115, 255)' size={22} />
            {player.location}
          </ToolTips>
        </li>
      )}
      {player.company && (
        <li key={player.company}>
          <ToolTips text="User's Company">
            <FaBriefcase color='#795548' size={22} />
            {player.company}
          </ToolTips>
        </li>
      )}
      <li key={0}>
        <FaUsers color='rgb(129, 195, 245)' size={22} />
        {player.followers.toLocaleString()} followers
      </li>
      <li key={1}>
        <FaUserFriends color='rgb(64, 183, 95)' size={22} />
        {player.following.toLocaleString()} following
      </li>
      <li key={2}>
        <FaCode color='rgb(59, 76, 85)' size={22} />
        {player.repos.toLocaleString()} repositories
      </li>
    </ul>
  );
}

function ProfilePreview({ position, player }) {
  return (
    <Card
      header={position}
      avatar={player.avatar}
      subheading={`Score: ${player.score.toLocaleString()}`}
      href={player.url}
      name={player.username}>
      <ProfileList player={player} />
    </Card>
  );
}

ProfilePreview.propTypes = {
  position: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired
};

ProfileList.propTypes = {
  player: PropTypes.object.isRequired
};

function resultReducer(state, action) {
  switch (action.type) {
    case 'Success':
      return {
        winner: action.players[0],
        loser: action.players[1],
        error: null,
        loading: false
      };
    case 'Error':
      return {
        winner: null,
        loser: null,
        loading: false,
        error: 'Could not battle players'
      };
    default:
      throw new Error('Action is not recognized');
  }
}

export default function Results(props) {
  const [state, dispatch] = React.useReducer(resultReducer, {
    winner: null,
    loser: null,
    error: null,
    loading: true
  });

  const { winner, loser, error, loading } = state;

  React.useEffect(() => {
    const { location } = props;
    const { playerOne, playerTwo } = queryString.parse(location.search);
    const players = [playerOne, playerTwo];
    battle(players)
      .then((players) => dispatch({ type: 'Success', players }))
      .catch(({ message }) => {
        console.warn(message);
        dispatch({ type: 'Error' });
      });
  }, []);

  if (loading) {
    return <Loading text='Battling' />;
  }

  if (error) {
    return <p className='center-text error'>{error}</p>;
  }

  return (
    <React.Fragment>
      <div className='grid space-around container-sm'>
        <ProfilePreview
          position={winner.score === loser.score ? 'Tie' : 'Winner'}
          player={winner}
        />
        <ProfilePreview
          position={winner.score === loser.score ? 'Tie' : 'Loser'}
          player={loser}
        />
      </div>
      <Link to='/battle' className='btn dark-btn btn-space'>
        Reset
      </Link>
    </React.Fragment>
  );
}
