import React, { Component } from "react";
import Logo1 from "../images/helling.png";
import Logo2 from "../images/u-fonds.jpg";
import Logo3 from "../images/a-eslogo.png";
import { Table, Tooltip, OverlayTrigger, Button, ButtonGroup, PageHeader } from 'react-bootstrap';

class PublicFooter extends Component {
  componentDidMount(){
    var img1 = document.getElementById("l1");
    img1.src = Logo1;
    var img2 = document.getElementById("l2");
    img2.src = Logo2;
    var img3 = document.getElementById("l3");
    img3.src = Logo3;
  }

  render() {
    return (
      <div className="footer-logos">       
        <div className="row row-no-gutters">      
          <a href="https://www.dehelling.nl/" target="_blank"><img id="l1" className="col-sm-3 sponsor align-middle" /></a>
          <a href="https://www.uu.nl/organisatie/alumni/utrechts-universiteitsfonds" target="_blank"><img id="l2" className="col-sm-3 sponsor align-middle" /></a>
          <a href="https://www.a-eskwadraat.nl/Home" target="_blank">  <img id="l3" className="col-sm-3 sponsor align-middle" /></a>
        </div>
        <div className="pt-2">
          <h3 className="text-center">© 2019 BÈTA MUSIC NIGHT</h3>
        </div>
      </div>
    );
  }
}

export default PublicFooter;
