import React, { Component } from "react";
import { dispatch } from '@Services/AppDispatcher.js';
import { Row, Col, FormGroup, ControlLabel,Alert, FormControl, Button } from 'react-bootstrap';
import { requestNewPassword } from '@Actions/PasswordActions.js';
import PropTypes from 'prop-types';
import {Container} from 'flux/utils';
import UserStore from '@Stores/UserStore.js';

/**
 * The availabilities page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
class PasswordResetPage extends Component {
    constructor(){
      super();
      this.send= this.send.bind(this);
    }
    //Dispatch the new password request action.
    send(e){
      e.preventDefault();
      dispatch(requestNewPassword(this.emailInput.value));
    }
    render(){
      let output = '';
      if(this.props.emailWasSent){
        output = (
          <p>Een e-mail is verstuurd met een link om een nieuw wachtwoord in te stellen!</p>
        );
      }
      else{
        output = (
          <React.Fragment>
            <p>Vul hieronder het email adres in van je account, dan krijg je een mailtje om je 
              wachtwoord te resetten.</p>
            <form onSubmit={(e) => this.send(e)}>
                  <FormGroup controlId="email">
                      <ControlLabel>E-mail adres</ControlLabel>
                      <FormControl
                          type="text"
                          placeholder="Voer e-mail in"
                          inputRef={ref => { this.emailInput = ref; }}
                      />
                      <FormControl.Feedback />
                  </FormGroup>
                  {this.props.error? (<Alert bsStyle="danger">Er ging wat fout: {this.props.error}</Alert>) : null}
                  <Button type="submit">Verstuur</Button>
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
  emailWasSent : PropTypes.bool
};
//Wrap the page in a Flux container that relays data from stores
export default Container.createFunctional(
    (state)=>(<PasswordResetPage emailWasSent={state.emailWasSent} error={state.error}/>), //View function
    
    ()=>[UserStore], //Required stores
    
    (prevState)=>{ //Determine the state needed
      return {
        emailWasSent: UserStore.passwordEmailSent,
        error: UserStore.requestPasswordError
      };
    }
);
