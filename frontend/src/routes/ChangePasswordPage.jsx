import React, { Component } from "react";
import {isEmptyString} from '@Utils/TypeChecks.js';
import {Form, Button, FormGroup, FormControl, ControlLabel, Alert, Col} from 'react-bootstrap';
import PasswordChangeComponent from '@Components/PasswordChangeComponent.jsx';
import {dispatch} from '@Services/AppDispatcher.js';
import {setNewPassword} from '@Actions/PasswordActions.js';
import PropTypes from 'prop-types';
import {Container} from 'flux/utils';
import UserStore from '@Stores/UserStore.js';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';

class ChangePasswordPage extends Component {
  constructor(props){
    super(props);
    this.saveNewPassword = this.saveNewPassword.bind(this);
    this.state = {};
    //From the router
    this.token = this.props.match.params.token;
  }
  saveNewPassword(password){
    dispatch(setNewPassword(password, this.token));
  }
  componentDidUpdate(prevProps){
    if(this.props.wasSet && !prevProps.wasSet){
      const redirectTime = this.props.redirectTime ? this.props.redirectTime * 1000 : 2 * 1000;
      if(!('redirecter' in this.state)){
        this.setState({redirecter: setTimeout(()=>{this.setState({doRedirect: true});}, redirectTime)});
      }
    }
  }
  
  render() { 
    return (
        <Col mdOffset={4} md={4}>
          <h3>Voer een nieuw wachtwoord in</h3>
          <PasswordChangeComponent onSave={this.saveNewPassword}/>
            {this.props.wasSet ? (<Alert bsStyle="success">
                    Je wachtwoord is gewijzigd! Je wordt zo doorgestuurd naar de <Link to="/login">login pagina</Link>
                    </Alert>) : null}
            {this.state.doRedirect ? (<Redirect to="/login"/>) : null}
        </Col>
    );
  }
}

ChangePasswordPage.propTypes = {
  match : PropTypes.object.isRequired,
  redirectTime: PropTypes.number,
  wasSet: PropTypes.bool
};

//Wrap the page in a Flux container that relays data from stores
export default Container.createFunctional(
    (state)=>(<ChangePasswordPage wasSet={state.wasSet} error={state.error} match={state.match}/>), //View function
    
    ()=>[UserStore], //Required stores
    
    (prevState,props)=>{ //Determine the state needed
      return {
        wasSet: UserStore.newPasswordSet,
        match: props.match ,
      };
    },
    {withProps:true}
);
