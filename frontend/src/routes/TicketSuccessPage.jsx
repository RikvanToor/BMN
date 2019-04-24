import React, { Component } from "react";
import background from "../images/bmncom.jpg";
import { LinkContainer } from "react-router-bootstrap";

class TicketSuccessPage extends Component {
  render() {
    return (
      <div className="text-light">
        <img className="fluid h-100 crop-to-screen" src={background} alt="Background"/>
        <div className="text-center success-style">
          <h2 className="kaarttekst">Aankoop geslaagd!</h2>
          <h2 className="kaarttekst">We kijken er naar uit u te verwelkomen op 5 juni in de Helling.</h2>
          <h2 className="kaarttekst">U zult snel een bevestiging ontvangen.</h2>
          <LinkContainer key="home" to="">
            <a href="#">
              <h3 className="link-back">Klik hier om terug te gaan naar de BMN-website!</h3>
            </a>
          </LinkContainer>
        </div>             
      </div>
    );
  }
}

export default TicketSuccessPage;