import React, { Component, PureComponent } from "react";
import {Container} from 'flux/utils';
import { dispatch } from '@Services/AppDispatcher.js';
import PropTypes from 'prop-types';
import { changePassword } from '@Actions/PasswordActions.js'
import { Redirect } from 'react-router';
import { FormGroup, Form,  FormControl, Alert, ControlLabel, Button, HelpBlock} from 'react-bootstrap';
import {isEmptyString} from '@Utils/TypeChecks.js';

//Data import
import UserStore from '@Stores/UserStore.js';

/**
 * The login page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
class AccountPage extends PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {
          newPassword:'',
          newPasswordConfirm:'',
          passwordError:'',
        };
        this.passwordChange = this.passwordChange.bind(this);
    }
    passwordChange(e){
      let newState = {};
      newState[e.target.id] = e.target.value;
      this.setState(newState);
    }
    clearPasswordState(){
      this.setState({
          newPassword:'',
          newPasswordConfirm:'',
          passwordError:'',
        });
    }
    /**
     * Apply the login action when the form is submitted.
     * @param {Event} e The form submit event
     */
    changePassword(e) {
      e.preventDefault();
      
      if(isEmptyString(this.state.newPassword) || isEmptyString(this.state.newPasswordConfirm)){
        this.setState({passwordError:'Beide wachtwoord velden moeten ingevuld zijn'});
        return;
      }
      if(this.state.newPassword !== this.state.newPasswordConfirm){
        this.setState({passwordError:'De ingevulde wachtwoorden komen niet overeen'});
        return;
      }
      //Apply the user based login action
      dispatch(changePassword(this.props.user.id, this.state.newPassword));

      //Clear the password state
      this.clearPasswordState();
    }

    render() {
        //Otherwise, render the login page
        return (
            <div>
                <h3>Wijzig mijn gegevens</h3>
                <b>TODO</b>
                <h3>Wijzig wachtwoord</h3>
                <Form inline onSubmit={(e) => this.changePassword(e)}>
                    <FormGroup controlId="newPassword">
                        <ControlLabel>Nieuw wachtwoord</ControlLabel>
                        <FormControl
                            type="password"
                            value={this.state.newPassword}
                            onChange={this.passwordChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>
                    <FormGroup
                        controlId="newPasswordConfirm"
                    >
                        <ControlLabel>Herhaal wachtwoord</ControlLabel>
                        <FormControl
                            type="password"
                            value={this.state.newPasswordConfirm}
                            onChange={this.passwordChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>
                    <Button bsStyle="primary" type="submit">Opslaan</Button>
                </Form>
                {!isEmptyString(this.state.passwordError) ? (<p className="text-danger">{this.state.passwordError}</p>) : null}
                {this.props.passwordSaved ? (<Alert bsStyle="success">Wachtwoord gewijzigd</Alert>) : null}
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
