import React, { Component, PureComponent } from "react";
import {Container} from 'flux/utils';
import { dispatch } from '@Services/AppDispatcher.js';
import PropTypes from 'prop-types';
import { changePassword } from '@Actions/PasswordActions.js'
import { Redirect } from 'react-router';
import { FormGroup, Form,  FormControl, Alert, ControlLabel, Button, HelpBlock, PageHeader} from 'react-bootstrap';
import {isEmptyString} from '@Utils/TypeChecks.js';
import PasswordChangeComponent from '@Components/PasswordChangeComponent.jsx';

//Data import
import UserStore from '@Stores/UserStore.js';

/**
 * The login page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
class AccountPage extends Component {
    constructor(props) {
        super(props);
        
        this.savePassword = this.savePassword.bind(this);
    }
    savePassword(pw){
      //Apply the user based login action
      dispatch(changePassword(this.props.user.id,pw));
    }

    render() {
        //Otherwise, render the login page
        return (
            <div>
                <PageHeader>Account</PageHeader>
                <h3>Wijzig mijn gegevens</h3>
                <b>TODO</b>
                <h3>Wijzig wachtwoord</h3>
                <PasswordChangeComponent passwordSaved={this.props.passwordSaved} onSave={this.savePassword} inline/>
            </div>
        );
    }
}

AccountPage.propTypes = {
  user: PropTypes.object.isRequired
};

//Add state to the login page.

//Wrap the page in a Flux container that relays data from stores
export default Container.createFunctional(
    (state)=>(<AccountPage user={state.user} passwordSaved={state.passwordSaved}/>), //View function
    
    ()=>[UserStore], //Required stores
    
    (prevState)=>{ //Determine the state needed
      return {
        user: UserStore.user,
        passwordSaved: UserStore.passwordSaved
      };
    }
);
