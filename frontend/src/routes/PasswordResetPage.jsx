import React, { Component } from "react";
import { dispatch } from '@Services/AppDispatcher.js';
import { getScheduleAction, getScheduleForPlayerAction } from '@Actions/RehearsalActions.js'
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { requestNewPassword } from '@Actions/PasswordActions.js';
import PropTypes from 'prop-types';
import AvailabilityWidget from '../components/AvailabilityWidget.jsx';

/**
 * The availabilities page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
export default class PasswordResetPage extends Component {
    constructor(){
      super();
      this.send= this.send.bind(this);
    }
    send(){
      dispatch(requestNewPassword(this.emailInput.value));
    }
    render(){
      let output = '';
      if(this.props.emailWasSent){
        output = (
          <p>Een e-mail is verstuurd met een link om een nieuw wachtwoord in te stellen</p>
        );
      }
      else{
        output = (
          <React.Fragment>
            <p>Vul hieronder het email adres in van je account, dan krijg je een mailtje om je 
              wachtwoord te resetten.</p>
            <form onSubmit={(e) => this.logIn(e)}>
                  <FormGroup controlId="email">
                      <ControlLabel>E-mail adres</ControlLabel>
                      <FormControl
                          type="text"
                          placeholder="Voer e-mail in"
                          inputRef={ref => { this.emailInput = ref; }}
                      />
                      <FormControl.Feedback />
                  </FormGroup>
                  <Button type="submit">Verstuur</Button>
                  <div style={{marginTop:'5px'}}><Link to="/">Wachtwoord vergeten?</Link></div>
            </form>
          </React.Fragment>
        );
      }
      return (
        <Row>
          <Col mdOffset={4} md={4}>
            <h1>Wachtwoord vergeten</h1>
            {output}
          </Col>
        </Row>
      );
    }
};
PasswordResetPage.propTypes = {
  emailWasSent : PropTypes.boolean
};