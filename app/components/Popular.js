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

export default class PopularGrid extends React.Component {
  state = {
    chosenLanguage: 'All',
    repos: {},
    error: null
  };
  componentDidMount() {
    this.pickLanguage(this.state.chosenLanguage);
  }
  pickLanguage = (language) => {
    this.setState({
      chosenLanguage: language,
      error: null
    });

    if (this.state.repos[language]) return;

    fetchPopularRepos(language)
      .then((data) => {
        this.setState(
          ({ repos }) =>
            (repos[language] = data.map((data, ind) => ({
              id: data.id,
              url: data.html_url,
              login: data.owner.login,
              name: data.name,
              avatar: data.owner.avatar_url,
              forks: data.forks,
              issues: data.open_issues,
              stars: data.stargazers_count,
              index: ind + 1
            })))
        );
      })
      .catch((err) => {
        console.warn('There was an error ' + err);

        this.setState({
          error: 'There was an error while fetching the repositories'
        });
      });
  };
  isLoading = () => {
    const { error, repos, chosenLanguage } = this.state;
    return !repos[chosenLanguage] && error === null;
  };
  render() {
    const { chosenLanguage, repos, error } = this.state;
    return (
      <React.Fragment>
        <Popular
          chosenLanguage={chosenLanguage}
          pickLanguage={this.pickLanguage}
        />
        {this.isLoading() && <Loading text='Fetching Repos' />}

        {error && <p className='center-text error'>{error}</p>}

        {repos[chosenLanguage] && <RepoGrid repos={repos[chosenLanguage]} />}
      </React.Fragment>
    );
  }
}
