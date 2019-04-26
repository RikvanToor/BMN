import React, { Component } from "react";
import Logo1 from "../images/helling.png";
import Logo2 from "../images/u-fonds.jpg";
import Logo3 from "../images/a-eslogo.png";
import { Col } from 'react-bootstrap';

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
      <footer className="public">
        <div className="row row-no-gutters logos"> 
          <div className="d-inline-block logos text-center">
            <Col xs={7} sm={3} className="sm-align-right"><a href="https://www.dehelling.nl/" target="_blank"><img id="l1" className="sponsor" /></a></Col>
            <Col xs={5} sm={3} className="col-sm-push-6 sm-align-left"><a href="https://www.a-eskwadraat.nl/Home" target="_blank">  <img id="l3" className="sponsor" /></a></Col>
            <Col xs={12} sm={6} className="col-sm-pull-3"><a href="https://www.uu.nl/organisatie/alumni/utrechts-universiteitsfonds" target="_blank"><img id="l2" className="sponsor" /></a></Col>
          </div>
        </div>
        <div className="text-center">
          <h3>&copy; Bèta Music Night 2019</h3>
          <a href="https://www.betamusicnight.nl/login">Deelnemers</a> - <a href="mailto:bmn@a-eskwadraat.nl">Contact</a>
        </div>
      </footer>
    );
  }
}

export default PublicFooter;
