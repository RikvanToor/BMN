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
import { PageHeader } from 'react-bootstrap';

class Photos extends Component {
  render() {
    const images = [Foto1, Foto2, Foto3, Foto4, Foto5, Foto6, Foto7, Foto8, Foto9];

    return (
      <div id="fotos" className="bg-dark text-center">
        <div className="gallery-style">
          <PageHeader>Foto's</PageHeader>

          <div className="row row-no-gutters">
            {images.map(x => <img key={x} className="col-xs-12 col-sm-4 padding-0" src={x} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default Photos;
