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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: 'light',
      toggleTheme: () => {
        this.setState(({ theme }) => ({
          theme: theme === 'light' ? 'dark' : 'light'
        }));
      }
    };
  }
  render() {
    return (
      <Router>
        <ThemeProvider value={this.state}>
          <div className={this.state.theme}>
            <div className='container'>
              <NavBar />
              <React.Suspense fallback={<Loading />}>
                <Switch>
                  <Route exact path='/' component={Popular} />
                  <Route exact path='/battle' component={Battle} />
                  <Route path='/battle/results' component={Results} />
                  <Route
                    render={() => (
                      <h1
                        style={{
                          fontSize: 70,
                          marginTop: '15%',
                          fontFamily: 'Dosis'
                        }}
                        className='header-lg center-text'>
                        404 😅
                      </h1>
                    )}
                  />
                </Switch>
              </React.Suspense>
            </div>
          </div>
        </ThemeProvider>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
