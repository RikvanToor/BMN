import React, { Component } from "react";
import Carousel from "../components/carousel.jsx";
import AppDispatcher from '@Services/AppDispatcher.js';
import {logIn as logInAction} from '@Actions/UserActions.js'
import {FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {username:"",password:""};
    }
    handleUserChange(e){
        this.setState({password: this.state.password, username: e.target.value});
    }
    handlePasswordChange(e){
        this.setState({password: e.target.value, username: this.state.username});
    }
    logIn(e){
        logInAction(this.state.username, this.state.password);
        //Clear password from obj
        this.state.password = "";
    }
    
    render() {
        return (
            <form>
            <FormGroup
              controlId="formUsername"
            >
            <ControlLabel>Gebruikersnaam</ControlLabel>
              <FormControl
                type="text"
                value={this.state.username}
                placeholder="Voer naam in"
                onChange={this.handleUserChange.bind(this)}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup
              controlId="formUsername"
            >
            <ControlLabel>Wachtwoord</ControlLabel>
              <FormControl
                type="password"
                value={this.state.password}
                onChange={this.handlePasswordChange.bind(this)}
              />
              <FormControl.Feedback />
            </FormGroup>
            <Button onClick={this.logIn.bind(this)}>Log in</Button>
          </form>
        );
    }
}

export default LoginPage;
