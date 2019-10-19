import React from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import { fetchPopularRepos } from '../utils/api';
import Tooltips from './Tooltips';
import Card from './Card';
import {
  FaUser,
  FaStar,
  FaCodeBranch,
  FaExclamationTriangle
} from 'react-icons/fa';

function Popular({ chosenLanguage, pickLanguage }) {
  const languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python'];
  return (
    <ul className='flex-center'>
      {languages.map((lang) => (
        <li key={lang}>
          <button
            style={
              lang === chosenLanguage ? { color: 'rgba(187, 46, 31)' } : null
            }
            onClick={() => pickLanguage(lang)}
            className='btn-clear nav-link'>
            {lang}
          </button>
        </li>
      ))}
    </ul>
  );
}

function RepoGrid({ repos }) {
  return (
    <ul className='grid space-around'>
      {repos.map((repo) => {
        const { id, url, avatar, login, stars, forks, issues, index } = repo;
        return (
          <li key={id}>
            <Card header={`#${index}`} avatar={avatar} href={url} name={login}>
              <ul className='card-list'>
                <li key={login}>
                  <Tooltips text='Github Username'>
                    <FaUser color='rgb(255, 191, 116)' size={22} />
                    <a href={`https://github.com/${login}`}>{login}</a>
                  </Tooltips>
                </li>
                <li key={stars}>
                  <FaStar color={'rgb(255, 215, 0)'} size={22} />
                  {stars.toLocaleString()} Stars
                </li>
                <li key={forks}>
                  <FaCodeBranch color={'rgb(129, 195, 245)'} size={22} />
                  {forks.toLocaleString()} Forks
                </li>
                <li key={issues}>
                  <FaExclamationTriangle
                    color={'rgb(241, 138, 147)'}
                    size={22}
                  />
                  {issues.toLocaleString()} open issues
                </li>
              </ul>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

Popular.propTypes = {
  chosenLanguage: PropTypes.string.isRequired,
  pickLanguage: PropTypes.func.isRequired
};

RepoGrid.protoTypes = {
  repos: PropTypes.array.isRequired
};

function languageReducer(state, action) {
  switch (action.type) {
    case 'Set Language':
      return {
        chosenLanguage: action.language,
        repos: state.repos,
        error: null
      };
    case 'Fetch Language':
      return {
        chosenLanguage: state.chosenLanguage,
        repos: { ...state.repos, ...action.repos },
        error: null
      };
    case 'Reset':
      return {
        chosenLanguage: null,
        repos: state.repos,
        error: null
      };
    case 'Error':
      return {
        chosenLanguage: null,
        repos: state.repos,
        error: action.error
      };
    default:
      throw new Error('Action is not recognized');
  }
}

export default function PopularGrid() {
  const [state, dispatch] = React.useReducer(languageReducer, {
    chosenLanguage: 'All',
    repos: {},
    error: null
  });

  const { chosenLanguage, repos, error } = state;

  const pickLanguage = (language) => {
    dispatch({ type: 'Set Language', language });

    if (repos[language]) return;

    fetchPopularRepos(language)
      .then((data) =>
        data.map((data, ind) => ({
          id: data.id,
          url: data.html_url,
          login: data.owner.login,
          name: data.name,
          avatar: data.owner.avatar_url,
          forks: data.forks,
          issues: data.open_issues,
          stars: data.stargazers_count,
          index: ind + 1
        }))
      )
      .then((data) => {
        dispatch({
          type: 'Fetch Language',
          repos: { [language]: data }
        });
      })
      .catch((err) => {
        console.warn(err);
        dispatch({ type: 'Error', error: 'Data unavailable' });
      });
  };

  React.useEffect(() => {
    pickLanguage(chosenLanguage);
  }, []);

  const isLoading = () => {
    return !repos[chosenLanguage] && error === null;
  };

  return (
    <React.Fragment>
      <Popular chosenLanguage={chosenLanguage} pickLanguage={pickLanguage} />
      {isLoading() && <Loading text='Fetching Repos' />}

      {error && <p className='center-text error'>{error}</p>}

      {repos[chosenLanguage] && <RepoGrid repos={repos[chosenLanguage]} />}
    </React.Fragment>
  );
}
