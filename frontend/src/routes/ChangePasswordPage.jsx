import React, { Component } from "react";
import {isEmptyString} from '@Utils/TypeChecks.js';
import {Form, Button, FormGroup, FormControl, ControlLabel, Alert, Col} from 'react-bootstrap';
import PasswordChangeComponent from '@Components/PasswordChangeComponent.jsx';
import {dispatch} from '@Services/AppDispatcher.js';
import {setNewPassword} from '@Actions/PasswordActions.js';

class ChangePasswordPage extends Component {
  constructor(props){
    super(props);
    this.saveNewPassword = this.saveNewPassword.bind(this);
    //From the router
    this.token = this.props.match.params.token;
  }
  saveNewPassword(id, password){
    dispatch(setNewPassword(password, this.token));
  }
  
  render() { 
    return (
        <Col mdOffset={4} md={4}>
          <h3>Voer een nieuw wachtwoord in</h3>
          <PasswordChangeComponent user={{id:0}} onSave={this.saveNewPassword}/>
        </Col>
    );
  }
}

export default ChangePasswordPage;
