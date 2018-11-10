//React library imports
import React, { Component } from "react";
import PropTypes from 'prop-types';

//UI imports
import Carousel from "../components/carousel.jsx";
import ConditionalComponent from '@Components/ConditionalComponent.jsx';

//Data imports
import {Container} from 'flux/utils';
import UserStore from '@Stores/UserStore.js';
import UsersStore from '@Stores/UsersStore.js';
import {deferredDispatch} from '@Services/AppDispatcher.js';
import {loadUsersAction} from '@Actions/UserActions.js';

class ParticipantHome extends Component {
  componentDidMount(){
      if(this.props.isAdmin){
            //This needs to be deferred since the loading of this component happens during a dispatch.
            deferredDispatch(loadUsersAction());
      }
  }
    render() {
    return (
        <div>
            
            <h1>Hallo {this.props.userName}</h1>
            <ConditionalComponent condition={this.props.isAdmin}>
                <div>
                    <p> Aangezien je een tof persoon bent, hier een lijstje van gebruikers:</p>
                    <table>
                    <thead>
                    <tr><td>Gebruiksnaam</td><td>Is een admin?</td></tr>
                    </thead>
                    <tbody>
                    {
                        this.props.users.map((user)=>{
                            return (<tr key={user.id}><td>{user.name}</td><td>{user.isCommittee ? 'Ja' : 'Nee'}</td></tr>) ;
                        })
                    }
                    </tbody>
                    </table>
                </div>
            </ConditionalComponent>
        </div>
    );
  }
}

//Setup proptypes for development checking
ParticipantHome.propTypes = {
  userName: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired  
};

//Wrap the page in a Flux container that relays data from stores
export default Container.createFunctional(
    (state)=>(<ParticipantHome userName={state.user.userName} isAdmin={state.user.isCommittee} users={state.users}/>), //View function
    
    ()=>[UserStore, UsersStore], //Required stores
    
    (prevState)=>{ //Determine the state needed
        return {user: UserStore.user, users:UsersStore.users};
    }
);