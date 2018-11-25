import React, { Component, PureComponent } from "react";
import {Container} from 'flux/utils';
import { dispatch } from '@Services/AppDispatcher.js';
import PropTypes from 'prop-types';
import { changePassword } from '@Actions/PasswordActions.js'
import { Redirect } from 'react-router';
import { FormGroup, Form,  FormControl, Alert, ControlLabel, Button, HelpBlock} from 'react-bootstrap';
import {isEmptyString, isUndefined} from '@Utils/TypeChecks.js';

//Data import
import UserStore from '@Stores/UserStore.js';

/**
 * The login page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
export default class PasswordChangeComponent extends Component {
  constructor(props) {
      super(props);

      this.state = {
        newPassword:'',
        newPasswordConfirm:'',
        passwordError:!isUndefined(this.props.passwordError) ? this.props.passwordError : '',
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
      
      let pass = this.state.newPassword;
      let pass2 = this.state.newPasswordConfirm;
      this.clearPasswordState();
      if(isEmptyString(pass) || isEmptyString(pass2)){
        this.setState({passwordError:'Beide wachtwoord velden moeten ingevuld zijn'});
      }
      else if(pass !== pass2){
        this.setState({passwordError:'De ingevulde wachtwoorden komen niet overeen'});
      }
      else{
        //Apply the user based login action
        this.props.onSave(this.props.user.id, pass);
      }
    }

    render() {
      let {user, passwordSaved,onSave, ...props} = this.props;
      return (
          <React.Fragment>
              <Form onSubmit={(e) => this.changePassword(e)} {...props}>
                  <FormGroup controlId="newPassword">
                      <ControlLabel>Nieuw wachtwoord</ControlLabel>
                      <FormControl
                          type="password"
                          value={this.state.newPassword}
                          onChange={this.passwordChange}
                      />
                      <FormControl.Feedback />
                  </FormGroup>
                  <FormGroup controlId="newPasswordConfirm">
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
              {!isUndefined(this.props.passwordSaved) ? (<Alert bsStyle="success">Wachtwoord gewijzigd</Alert>) : null}
          </React.Fragment>
      );
    }
}

PasswordChangeComponent.propTypes = {
  user: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  passwordSaved: PropTypes.bool
};