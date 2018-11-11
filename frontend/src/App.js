import React, { Component } from "react";
import {Container} from 'flux/utils';
import Wrapper from './components/wrapper.jsx';
import UserStore from '@Stores/UserStore.js';
import { dispatch } from '@Services/AppDispatcher.js';
import { checkLoginAction } from '@Actions/UserActions.js'
import CSS from './App.css';

/*
 * Main entry point of the BMN frontend.
 */
class App extends Component {
  static calculateState(prevState) {
    return {
      doneFetchingUser: UserStore.doneFetchingUser
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
    return <Wrapper ReadyToRender={this.state.doneFetchingUser} />
  }
}

export default Container.create(App);
