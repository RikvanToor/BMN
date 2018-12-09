import React, { Component, PureComponent } from "react";
import Carousel from "@Components/carousel.jsx";
import { dispatch } from '@Services/AppDispatcher.js';
import { logInAction } from '@Actions/UserActions.js'
import { Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { FormGroup, FormControl, ControlLabel, Button, Row, Col, Alert, PageHeader } from 'react-bootstrap';

/**
 * The login page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
class LoginPage extends PureComponent {
    constructor(props) {
        super(props);
    }
    /**
     * Apply the login action when the form is submitted.
     * @param {Event} e The form submit event
     */
    logIn(e) {
        //Apply the user based login action
        dispatch(logInAction(this.userInput.value, this.passInput.value));

        //Prevent any default action on the form.
        e.preventDefault();
    }

    render() {
        //If the user is already logged in, redirect
        if (this.props.isLoggedIn) {
            return (<Redirect to='/homeParticipant' />);
        }
        //Otherwise, render the login page
        return (
            <Row>
              <Col mdOffset={4} md={4}>
                <PageHeader>Login</PageHeader>
                <form onSubmit={(e) => this.logIn(e)}>
                    <FormGroup controlId="formUsername">
                        <ControlLabel>Gebruikersnaam</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Voer naam in"
                            inputRef={ref => { this.userInput = ref; }}
                        />
                        <FormControl.Feedback />
                    </FormGroup>
                    <FormGroup
                        controlId="formPassword"
                    >
                        <ControlLabel>Wachtwoord</ControlLabel>
                        <FormControl
                            type="password"
                            inputRef={ref => { this.passInput = ref; }}
                        />
                        <FormControl.Feedback />
                    </FormGroup>
                    {this.props.loginFailed ? (<Alert bsStyle="danger">Deze combo kennen we niet. Nog een keer proberen?</Alert>) : null}
                    <Button type="submit">Log in</Button>
                    <div style={{marginTop:'5px'}}><Link to="/wachtwoordreset">Wachtwoord vergeten?</Link></div>
                </form>
              </Col>
            </Row>
        );
    }
}

//Add state to the login page.

export default LoginPage;
