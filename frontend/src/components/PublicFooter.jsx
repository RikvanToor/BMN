import React, { Component } from "react";
import Logo1 from "../images/helling.png";
import Logo2 from "../images/u-fonds.jpg";
import Logo3 from "../images/a-eslogo.png";
import { Table, Tooltip, OverlayTrigger, Button, ButtonGroup, PageHeader } from 'react-bootstrap';

class PublicFooter extends Component {
  render() {
    return (
      <div className="footer-logos">       
        <div className="row row-no-gutters">      
          <a href="https://www.dehelling.nl/" target="_blank"><img className="col-sm-3 sponsor align-middle" src={Logo1} /></a>
          <a href="https://www.uu.nl/organisatie/alumni/utrechts-universiteitsfonds" target="_blank"><img className="col-sm-3 sponsor align-middle" src={Logo2} /></a>
          <a href="https://www.a-eskwadraat.nl/Home" target="_blank">  <img className="col-sm-3 sponsor align-middle" src={Logo3} /></a>
        </div>
        <div className="pt-2">
          <h3 className="text-center">© 2019 BÈTA MUSIC NIGHT</h3>
        </div>
      </div>
    );
  }
}

export default PublicFooter;
