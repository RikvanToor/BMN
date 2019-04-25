import React, { Component } from "react";
import background from "../images/bmncom.jpg";
import { LinkContainer } from "react-router-bootstrap";

class TicketSuccessPage extends Component {
  render() {
    return (
      <div className="text-light success-wrapper" style={{backgroundImage: `url(${background})`}}>
        <div className="text-center">
          <h2>Aankoop geslaagd!</h2>
          <h2>We kijken er naar uit u te verwelkomen op 5 juni in de Helling.</h2>
          <h2>U zult snel een bevestiging ontvangen.</h2>
          <LinkContainer key="home" to="">
            <a href="#">
              <h3>Klik hier om terug te gaan naar de BMN-website!</h3>
            </a>
          </LinkContainer>
        </div>             
      </div>
    );
  }
}
export default TicketSuccessPage;