import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ThemeProvider } from './context/Theme';
import Loading from './components/Loading';
import NavBar from './components/Nav';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Popular = React.lazy(() => import('./components/Popular'));
const Battle = React.lazy(() => import('./components/Battle'));
const Results = React.lazy(() => import('./components/Results'));
const ErrorPage = () => (
  <h1
    style={{
      fontSize: 70,
      marginTop: '15%',
      fontFamily: 'Dosis'
    }}
    className='header-lg center-text'>
    404 😅
  </h1>
);

function App() {
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () =>
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));

  return (
    <Router>
      <ThemeProvider value={theme}>
        <div className={theme}>
          <div className='container'>
            <NavBar toggleTheme={toggleTheme} />
            <React.Suspense fallback={<Loading />}>
              <Switch>
                <Route exact path='/' component={Popular} />
                <Route exact path='/battle' component={Battle} />
                <Route path='/battle/results' component={Results} />
                <Route render={() => <ErrorPage />} />
              </Switch>
            </React.Suspense>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
