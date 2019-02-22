import React, { Component } from "react";
import foto1 from "../images/foto1.jpg";
import foto2 from "../images/foto2.jpg";
import foto3 from "../images/foto3.jpg";
import logo from "../images/logogroot.png";
import CarouselComp from 'react-bootstrap/lib/Carousel';

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <CarouselComp>
        <CarouselComp.Item className="carousel-style">
          <img className="d-block w-100 fluid" src={foto1} alt="First slide"/>
          <CarouselComp.Caption>
            <img className="d-block w-100 logo-style fluid" src={logo} alt="Logo"/>
          </CarouselComp.Caption>
        </CarouselComp.Item>
        <CarouselComp.Item className="carousel-style">
          <img className="d-block w-100 fluid" src={foto2} alt="Second slide" />
          <CarouselComp.Caption>
            <img className="d-block w-100 logo-style fluid" src={logo} alt="Logo"/>
          </CarouselComp.Caption>
        </CarouselComp.Item>
        <CarouselComp.Item className="carousel-style">
          <img className="d-block w-100 fluid" src={foto3} alt="Third slide" />
          <CarouselComp.Caption>
            <img className="d-block w-100 logo-style fluid" src={logo} alt="Logo" />
          </CarouselComp.Caption>
        </CarouselComp.Item>
      </CarouselComp>
    );
  }
}

export default Carousel;
