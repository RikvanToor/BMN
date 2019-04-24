import React, { Component } from "react";
import { Container } from 'flux/utils';
import Wrapper from './components/wrapper.jsx';
import Public from './components/public.jsx';
import UserStore from '@Stores/UserStore.js';
import { dispatch } from '@Services/AppDispatcher.js';
import { checkLoginAction } from '@Actions/UserActions.js'
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from 'history';
import CSS from './App.css';
import TicketPurchaseLanding from "./components/TicketPurchaseLanding.jsx";
import TicketPage from "./routes/TicketPage.jsx";

const browserHistory = createBrowserHistory();

browserHistory.listen(location => {
    const { hash } = location;
    if (hash !== '') {
        // Push onto callback queue so it runs after the DOM is updated,
        // this is required when navigating from a different page so that
        // the element is rendered on the page before trying to getElementById.
        setTimeout(
            () => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView();
                }
            },
            0
        );
    }
});

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
    return <Router history={browserHistory}>
      <Route path='*'>
        <Switch>
          <Route key='public' exact path='(|/public)' render={() => <Public />} />
          <Route key='public' exact path='(|/bevestiging)' render={() => <TicketPurchaseLanding/>} />
          <Route key='public' exact path='(|/tickets)' render={() => <TicketPage/>} />
          <Route key='private' path='*' render={() => <Wrapper ReadyToRender={this.state.doneFetchingUser} user={this.state.user} />} />
        </Switch>
      </Route>
    </Router>;
  }
}

export default Container.create(App);
