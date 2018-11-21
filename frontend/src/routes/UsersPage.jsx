import React, { Component, PureComponent } from "react";

import {Container} from 'flux/utils';
import UsersStore from '@Stores/UsersStore.js';

import {Record} from 'immutable';

import { deferredDispatch } from '@Services/AppDispatcher.js';
import { Alert, Table, Form, FormGroup, Col, FormControl, HelpBlock, ControlLabel, Panel, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {isEmptyString} from '@Utils/TypeChecks.js';
import {createUser} from '@Actions/UserActions.js';

class UserDataRecord extends Record({name:'',userName:'',password:'',passwordConfirm:'',email:''}){
  toCreatableUser(){
    return {
          username : this.userName,
          name: this.name,
          password : this.password,
          email: this.email,
          'is_active': true
        };
  }
  arePasswordsConsistent(){
    return this.password === this.passwordConfirm;
  }
};

/**
 * The rehearsals page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
class UsersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          user : new UserDataRecord(),
          errs: new UserDataRecord()
        };
        this.handleNewUser = this.handleNewUser.bind(this);
        this.handleNewUserField = this.handleNewUserField.bind(this);
    }
    renderFormEntry(label, stateId, controlTag, controlProps){
      let Tag = controlTag;
      
      let errMsg = this.state.errs.get(stateId);
      console.log(errMsg);
      
      const hasError= errMsg.length > 0;
      let valState= hasError ? { validationState:'error'} : {};
      let props = {onChange: this.handleNewUserField, ...controlProps};
            
      return (
              <FormGroup controlId={stateId} {...valState}>
                <Col componentClass={ControlLabel} sm={3}>{label}</Col>
                <Col sm={6}>
                    <Tag {...props}/>
                    {hasError ? (<HelpBlock>{errMsg}</HelpBlock>) : null}
                </Col>
              </FormGroup>
        );
    }
    handleNewUserField(e){
      let id = e.target.id;
      //Ignore empty ids
      if(id.length === 0) return;
      
      let val = e.target.value;
      
      //Update the state
      this.setState({user: this.state.user.set(id,val)});
    }
    
    validateNewUser(){
      const fields = ['name','userName','email','password','passwordConfirm'];
      let errObj = {};
      let hasErr = false;
      
      //Check for empty fields
      fields.forEach((field)=>{
        if(isEmptyString(this.state.user.get(field))){
          errObj[field] = 'Dit veld mag niet leeg zijn';
          hasErr = true;
        }
      });
      
      if(!this.state.user.arePasswordsConsistent()){
        errObj['passwordConfirm'] = 'Dit wachtwoord komt niet overeen met de vorige.';
        hasErr = true;
      }
      if(hasErr){
        console.log(errObj);
      }
      this.setState({errs:new UserDataRecord(errObj)});
      return hasErr;
    }
    handleNewUser(e){
      //Don't actually submit the form. We send it ourselves
      e.preventDefault();
      const hasErr = this.validateNewUser();
      
      //Create the user
      if(!hasErr){
        deferredDispatch(createUser(this.state.user.toCreatableUser()));
      }
    }
    //Dirty hack, find something nice for this
    static getDerivedStateFromProps(props,state){
      if('savedUser' in props && props.savedUser){
        return {errs: new UserDataRecord(), user: new UserDataRecord()};
      }
      return null;
    }
    
    render(){
      return (
        <div>
          <h3>Gebruikers</h3>
          <Panel>
          <Panel.Heading>Nieuwe gebruiker</Panel.Heading>
          <Panel.Body>
            <Form horizontal onSubmit={this.handleNewUser}>
            {this.renderFormEntry('Naam', 'name', FormControl, {type:'text', value: this.state.user.name})}
            {this.renderFormEntry('Gebruikersnaam', 'userName', FormControl, {type:'text', value: this.state.user.userName})}
            {this.renderFormEntry('Email', 'email', FormControl, {type:'text', value: this.state.user.email})}
            {this.renderFormEntry('Wachtwoord', 'password', FormControl, {type:'password', value: this.state.user.password})}
            {this.renderFormEntry('Wachtwoord nog een keer', 'passwordConfirm', FormControl, {type:'password', value: this.state.user.passwordConfirm})}
            <FormGroup>
              <Col smOffset={3} sm={3}>
              <Button type="submit">Opslaan</Button>
              </Col>
            </FormGroup>        
            </Form>
            {'savedUser' in this.props && this.props.savedUser ? (<Alert bsStyle="success">Gebruiker '{this.props.savedUser}' aangemaakt</Alert>) : null} 
          </Panel.Body>
          </Panel>
        </div>
      );
    }
}
//Wrap the page in a Flux container that relays data from stores
export default Container.createFunctional(
    (state)=>(<UsersPage savedUser={state.savedUser}/>), //View function
    
    ()=>[UsersStore], //Required stores
    
    (prevState)=>{ //Determine the state needed
        
        return {savedUser: UsersStore.lastCreatedUser};
    }
);