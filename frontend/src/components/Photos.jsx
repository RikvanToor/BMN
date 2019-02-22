import React, { Component } from "react";
import Foto1 from "../images/foto4.jpg";
import Foto2 from "../images/foto5.jpg";
import Foto3 from "../images/foto6.jpg";
import Foto4 from "../images/foto7.jpg";
import Foto5 from "../images/foto8.jpg";
import Foto6 from "../images/foto9.jpg";
import Foto7 from "../images/foto10.jpg";
import Foto8 from "../images/foto11.jpg";
import Foto9 from "../images/foto12.jpg";
import { Table, Tooltip, OverlayTrigger, Button, ButtonGroup, PageHeader } from 'react-bootstrap';

class Photos extends Component {
  render() {
    return (
      <div id="fotos" className="bg-dark text-center">
        <div className="gallery-style"> 
          <PageHeader>Foto's</PageHeader>

          <div className="row row-no-gutters">      
            <img className="col-sm-4 padding-0" src={Foto1} />
            <img className="col-sm-4 padding-0" src={Foto2} />
            <img className="col-sm-4 padding-0" src={Foto3} />
          </div>
          <div className="row row-no-gutters">      
            <img className="col-sm-4 padding-0" src={Foto4} />
            <img className="col-sm-4 padding-0" src={Foto5} />
            <img className="col-sm-4 padding-0" src={Foto6} />
          </div>
          <div className="row row-no-gutters">      
            <img className="col-sm-4 padding-0" src={Foto7} />
            <img className="col-sm-4 padding-0" src={Foto8} />
            <img className="col-sm-4 padding-0" src={Foto9} />
          </div>
        </div>
      </div>
    );
  }
}

export default Photos;
