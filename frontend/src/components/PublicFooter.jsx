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
          <img className="col-sm-4" src={Logo1} />
          <img className="col-sm-4" src={Logo2} />
          <img className="col-sm-4" src={Logo3} />
        </div>
      </div>
    );
  }
}

export default PublicFooter;
