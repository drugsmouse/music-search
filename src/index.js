import { render } from 'react-dom';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, IndexRedirect, hashHistory } from 'react-router';
import STORE from './redux-store/index';
import injectTapEventPlugin from 'react-tap-event-plugin';
// web components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Page from './components/layout/Page';
// pages
import Search from './components/pages/Search';
import RecentActivity from './components/pages/RecentActivity';
import PlayLists from './components/pages/PlayLists';
injectTapEventPlugin();

render(
  <MuiThemeProvider>
    <Provider store={STORE}>
      <Router history={hashHistory}>
        <Route path="/" component={Page}>
          <IndexRedirect to="/search"/>
          <Route path="search" components={{ content: Search, header: Header, footer: Footer }}/>
          <Route path="recent-activity" components={{ content: RecentActivity, header: Header, footer: Footer }}/>
          <Route path="play-lists" components={{ content: PlayLists, header: Header, footer: Footer }}/>
        </Route>
        <Redirect path="*" to="search"/>
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
);
