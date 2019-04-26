import React, { Component } from "react";

//UI
import Footer from "./footer.jsx";
import { BrowserRouter, Route } from "react-router-dom";
import {Redirect} from 'react-router';
import { Grid, Row } from 'react-bootstrap';

//Routes
import LoginContainer from "@Containers/LoginContainer.jsx";
import NavigationContainer from "@Containers/NavigationContainer.jsx";
import NewsContainer from '@Containers/NewsContainer.jsx';
import RehearsalContainer from '@Containers/RehearsalContainer.jsx';
import SongsContainer from '@Containers/SongsContainer.jsx';
import SongContainer from '@Containers/SongContainer.jsx';
import AvailabilityContainer from '@Containers/AvailabilityContainer.jsx';
import ParticipantHome from "@Routes/ParticipantHome.jsx";
import RehearsalEditPage from '@Routes/RehearsalEditPage.jsx';
import UsersPage from '@Routes/UsersPage.jsx'
import AccountPage from '@Routes/AccountPage.jsx'
import PasswordResetPage from '@Routes/PasswordResetPage.jsx'
import ConditionalComponent from '@Components/ConditionalComponent.jsx';
import ChangePasswordPage from '@Routes/ChangePasswordPage.jsx';
import SetlistEditPage from '@Routes/SetlistEditPage.jsx';
import AddSuggestionPage from '@Routes/AddSuggestionPage.jsx';
import CheckAvailability from '@Routes/CheckAvailability.jsx';
import TicketPage from '@Routes/TicketPage.jsx';
import TicketSuccessPage from '@Routes/TicketSuccessPage.jsx';

/**
 * Main routes in the application
 */
import Home from '@Routes/Home.jsx';
import SuggestionList from '@Routes/SuggestionList.jsx';

const Roles = {
    GUEST : 'guest',
    USER: 'user',
    COMMITTEE: 'committee'
};

function withRole(role, routes){
    return routes.map((route)=>Object.assign(route,{role:role}));
}

//Routes in the app
const routes = [].concat(
    withRole(Roles.GUEST, [
        {target:'/home',                   component:Home},
        {target:'/login',                  component:LoginContainer},
        {target:'/wachtwoordreset',        component:PasswordResetPage},
        {target:'/nieuwwachtwoord/:token', component:ChangePasswordPage},
        {target:'/tickets',                component:TicketPage},
    ]),
    withRole(Roles.USER, [
        {target:'/rooster',         component:RehearsalContainer},
        {target:'/homeParticipant', component:ParticipantHome},
        {target:'/aanwezigheid',    component:AvailabilityContainer},
        {target:'/account',         component:AccountPage},
        {target:'/nummers',                component:SongsContainer},
        {target:'/nummer/:id',             component:SongContainer},
        {target:'/nieuws',                 component:NewsContainer},
        {target:'/suggestieToevoegen',     component:AddSuggestionPage},

    ]),
    withRole(Roles.COMMITTEE, [
        {target:'/suggesties',        component:SuggestionList},
        {target:'/roosterAanpassen',  component:RehearsalEditPage},
        {target:'/gebruikersbeheer',  component:UsersPage},
        {target:'/setlist',           component:SetlistEditPage},
        {target:'/beschikbaarheden',  component:CheckAvailability}
    ]) 
);

class Wrapper extends Component {
    render() {
      //Wait until we are ready to render
      if(!this.props.ReadyToRender) return null;
      
      //Setup roles
      let roles = {};
      roles.guest = true;
      roles.user = this.props.user.isLoggedIn;
      roles.committee = roles.user && this.props.user.isCommittee;
      
      //Redirect target
      const redirectTarget = '/login';
            
      //Route creation function
      let exactRouteFn = (routeObj,redirect)=>{
        //The component to render
        let Comp = routeObj.component;
        //Render function, taking into account the role of the user, redirects if the 
        //role is not present
        let renderFn = (props) =>{
          return (
          <ConditionalComponent condition={roles[routeObj.role]} otherwise={(<Redirect to={redirect}/>)}>
          <Comp {...props}/>
          </ConditionalComponent>);
        };
        return (<Route key={routeObj.target} exact path={routeObj.target} render={renderFn}/>);
      };
      
      return (
          <BrowserRouter>
              <div className="bg-light">
                  <NavigationContainer />
                  <Grid>
                      <Row>
                          {routes.map((el)=>exactRouteFn(el, redirectTarget))}
                      </Row>
                  </Grid>
                  <Footer />
              </div>
          </BrowserRouter>
        );
    }
};

export default Wrapper;