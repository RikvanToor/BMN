import React, { Component } from "react";
import { Container } from 'flux/utils';
import Wrapper from './components/wrapper.jsx';
import Public from './components/public.jsx';
import UserStore from '@Stores/UserStore.js';
import { dispatch } from '@Services/AppDispatcher.js';
import { checkLoginAction } from '@Actions/UserActions.js'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CSS from './App.css';

/*
 * Main entry point of the BMN frontend.
 */
class App extends Component {
  static calculateState(prevState) {
    return {
      doneFetchingUser: UserStore.doneFetchingUser,
      user: UserStore.user
    };
  }

  componentWillMount() {
    //UserStore.addListener(this.forceRender);
    dispatch(checkLoginAction());
  }

  static getStores() {
    return [UserStore];
  }

  render() {
    return <BrowserRouter>
      <Route path='*'>
        <Switch>
          <Route key='public' exact path='(|/public)' render={() => <Public />} />
          <Route key='private' path='*' render={() => <Wrapper ReadyToRender={this.state.doneFetchingUser} user={this.state.user} />} />
        </Switch>
      </Route>
    </BrowserRouter>;
  }
}

export default Container.create(App);
