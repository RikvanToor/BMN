//Data imports
import {Container} from 'flux/utils';
import UsersStore from '@Stores/UsersStore.js';
import UserStore from '@Stores/UserStore.js';
import {Record} from 'immutable';
import UserDataRecord from '@Models/UserDataRecord.js';

//Interaction
import { deferredDispatch } from '@Services/AppDispatcher.js';
import {createUser, loadUsersAction} from '@Actions/UserActions.js';

//UI imports
import React, { Component, PureComponent } from "react";
import { Alert, Table, Form, FormGroup, Col, FormControl, HelpBlock, ControlLabel, Panel, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {isEmptyString} from '@Utils/TypeChecks.js';

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
    componentDidMount() {
        if (this.props.isAdmin) {
            //This needs to be deferred since the loading of this component happens during a dispatch.
            deferredDispatch(loadUsersAction());
        }
    }
    renderFormEntry(label, stateId, controlTag, controlProps){
      let Tag = controlTag;
      
      let errMsg = this.state.errs.get(stateId);

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
      const fields = ['name','username','email','password','passwordConfirm'];
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
      let newState = {};
      let modified =false;
      if('savedUser' in props && props.savedUser){
        modified = true;
        newState.errs = new UserDataRecord();
        newState.user = new UserDataRecord();
      }
      if('userCreateErrors' in props){
        newState.errs = new UserDataRecord(props.userCreateErrors);
        modified = true;
      }
      if(modified) return newState;
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
            {this.renderFormEntry('Gebruikersnaam', 'username', FormControl, {type:'text', value: this.state.user.username})}
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
          <h4>Bekende gebruikers</h4>
           <Table striped bordered condensed hover responsive>
              <thead>
                  <tr>
                      <th>Gebruikersnaam</th>
                      <th>Naam</th>
                      <th>E-mail</th>
                      <th>Commissie?</th>
                  </tr>
              </thead>
              <tbody>
                {this.props.users.map((user)=>{
                  return (<tr key={user.id}>
                  <td>{user.userName}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isCommittee ? 'Ja' : 'Nee'}</td>
                  </tr>);
                })}
              </tbody>
          </Table>
        </div>
      );
    }
}
//Wrap the page in a Flux container that relays data from stores
export default Container.createFunctional(
    (state)=>(<UsersPage savedUser={state.savedUser} users={state.users} isAdmin={state.isAdmin} userCreateErrors={state.userCreateErrors}/>), //View function
    
    ()=>[UsersStore, UserStore], //Required stores
    
    (prevState)=>{ //Determine the state needed
      return {
        savedUser: UsersStore.lastCreatedUser, 
        userCreateErrors: UsersStore.userCreateErrors, 
        isAdmin: UserStore.user.isCommittee,
        users: UsersStore.users
      };
    }
);