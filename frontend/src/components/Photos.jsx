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
  componentDidMount() {
    var img1 = document.getElementById("fs1");
    img1.src = Foto1;
    var img2 = document.getElementById("fs2");
    img2.src = Foto2;
    var img3 = document.getElementById("fs3");
    img3.src = Foto3;
    var img4 = document.getElementById("f4");
    img4.src = Foto4;
    var img5 = document.getElementById("f5");
    img5.src = Foto5;
    var img6 = document.getElementById("f6");
    img6.src = Foto6;
    var img7 = document.getElementById("f7");
    img7.src = Foto7;
    var img8 = document.getElementById("f8");
    img8.src = Foto8;
    var img9 = document.getElementById("f9");
    img9.src = Foto9;
  }

  render() {
    return (
      <div id="fotos" className="bg-dark text-center">
        <div className="gallery-style"> 
          <PageHeader>Foto's</PageHeader>
        
          <div className="row row-no-gutters">      
            <img id="fs1" className="col-sm-4 padding-0" />
            <img id="fs2" className="col-sm-4 padding-0" />
            <img id="fs3" className="col-sm-4 padding-0" />
          </div>
          <div className="row row-no-gutters">      
            <img id="f4" className="col-sm-4 padding-0" />
            <img id="f5" className="col-sm-4 padding-0" />
            <img id="f6" className="col-sm-4 padding-0" />
          </div>
          <div className="row row-no-gutters">      
            <img id="f7" className="col-sm-4 padding-0" />
            <img id="f8" className="col-sm-4 padding-0" />
            <img id="f9" className="col-sm-4 padding-0" />
          </div>
        </div>
      </div>
    );
  }
}

export default Photos;
