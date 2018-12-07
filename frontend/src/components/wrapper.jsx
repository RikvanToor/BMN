import React, { Component } from "react";

//UI
import Footer from "./footer.jsx";
import { BrowserRouter, Route } from "react-router-dom";
import { Redirect } from "react-router";
import { Grid, Row } from "react-bootstrap";

//Routes
import LoginContainer from "@Containers/LoginContainer.jsx";
import NavigationContainer from "@Containers/NavigationContainer.jsx";
import RehearsalContainer from "@Containers/RehearsalContainer.jsx";
import AvailabilityContainer from "@Containers/AvailabilityContainer.jsx";
import ParticipantHome from "@Routes/ParticipantHome.jsx";
import RehearsalEditPage from "@Routes/RehearsalEditPage.jsx";
import UsersPage from "@Routes/UsersPage.jsx";
import AccountPage from "@Routes/AccountPage.jsx";
import PasswordResetPage from "@Routes/PasswordResetPage.jsx";
import ConditionalComponent from "@Components/ConditionalComponent.jsx";
import ChangePasswordPage from "@Routes/ChangePasswordPage.jsx";
import CheckAvailability from "@Routes/CheckAvailability.jsx";

/**
 * Main routes in the application
 */
import Home from "@Routes/Home.jsx";
import SuggestionList from "@Routes/SuggestionList.jsx";

//Routes in the app
const routes = [
  { target: "/home", component: Home, role: "guest" },
  { target: "/login", component: LoginContainer, role: "guest" },
  { target: "/rooster", component: RehearsalContainer, role: "user" },
  { target: "/suggesties", component: SuggestionList, role: "committee" },
  { target: "/homeParticipant", component: ParticipantHome, role: "user" },
  {
    target: "/roosterAanpassen",
    component: RehearsalEditPage,
    role: "committee"
  },
  { target: "/aanwezigheid", component: AvailabilityContainer, role: "user" },
  { target: "/gebruikersbeheer", component: UsersPage, role: "committee" },
  { target: "/account", component: AccountPage, role: "user" },
  { target: "/wachtwoordreset", component: PasswordResetPage, role: "guest" },
  {
    target: "/nieuwwachtwoord/:token",
    component: ChangePasswordPage,
    role: "guest"
  },
  {
    target: "/beschikbaarheidBekijken",
    component: CheckAvailability,
    role: "committee"
  }
];

class Wrapper extends Component {
  render() {
    //Wait until we are ready to render
    if (!this.props.ReadyToRender) return null;

    //Setup roles
    let roles = {};
    roles.guest = true;
    roles.user = this.props.user.isLoggedIn;
    roles.committee = roles.user && this.props.user.isCommittee;

    //Redirect target
    const redirectTarget = "/login";

    //Route creation function
    let exactRouteFn = (routeObj, redirect) => {
      //The component to render
      let Comp = routeObj.component;
      //Render function, taking into account the role of the user, redirects if the
      //role is not present
      let renderFn = props => {
        return (
          <ConditionalComponent
            condition={roles[routeObj.role]}
            otherwise={<Redirect to={redirect} />}
          >
            <Comp {...props} />
          </ConditionalComponent>
        );
      };
      return (
        <Route
          key={routeObj.target}
          exact
          path={routeObj.target}
          render={renderFn}
        />
      );
    };

    return (
      <BrowserRouter>
        <div className="bg-light">
          <NavigationContainer />
          <Grid>
            <Row>{routes.map(el => exactRouteFn(el, redirectTarget))}</Row>
          </Grid>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default Wrapper;
