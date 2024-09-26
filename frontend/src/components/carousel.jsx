import React, { Component } from "react";
import foto1 from "../images/foto1.jpg";
import foto2 from "../images/foto2.jpg";
import foto3 from "../images/foto3.jpg";
import logo from "../images/BMN2021.png";
import CarouselComp from 'react-bootstrap/lib/Carousel';

class Carousel extends Component {
  render() {
    return (
      <CarouselComp>
        <CarouselComp.Item className="carousel-style">
          <img className="d-block w-100 fluid" alt="First slide" src={foto1} />
          <CarouselComp.Caption>
            <img className="d-block w-100 logo-style fluid" alt="Logo" src={logo} />
          </CarouselComp.Caption>
        </CarouselComp.Item>
        <CarouselComp.Item className="carousel-style">
          <img className="d-block w-100 fluid" alt="Second slide" src={foto2} />
          <CarouselComp.Caption>
            <img className="d-block w-100 logo-style fluid" alt="Logo" src={logo} />
          </CarouselComp.Caption>
        </CarouselComp.Item>
        <CarouselComp.Item className="carousel-style">
          <img className="d-block w-100 fluid" alt="Third slide" src={foto3} />
          <CarouselComp.Caption>
            <img className="d-block w-100 logo-style fluid" alt="Logo" src={logo} />
          </CarouselComp.Caption>
        </CarouselComp.Item>
      </CarouselComp>
    );
  }
}

export default Carousel;
