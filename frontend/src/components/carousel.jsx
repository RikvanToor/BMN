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

  componentDidMount(){
    var imgLogo1 = document.getElementById("logo1");
    imgLogo1.src = logo;
    var imgLogo2 = document.getElementById("logo2");
    imgLogo2.src = logo;
    var imgLogo3 = document.getElementById("logo3");
    imgLogo3.src = logo;
    var img1 = document.getElementById("f1");
    img1.src = foto1;
    var img2 = document.getElementById("f2");
    img2.src = foto2;
    var img3 = document.getElementById("f3");
    img3.src = foto3;
  }
  render() {
    return (
      <CarouselComp>
        <CarouselComp.Item className="carousel-style">
          <img id="f1" className="d-block w-100 fluid" alt="First slide"/>
          <CarouselComp.Caption>
            <img id="logo1" className="d-block w-100 logo-style fluid" alt="Logo"/>
          </CarouselComp.Caption>
        </CarouselComp.Item>
        <CarouselComp.Item className="carousel-style">
          <img id="f2" className="d-block w-100 fluid" alt="Second slide" />
          <CarouselComp.Caption>
            <img id="logo2" className="d-block w-100 logo-style fluid" alt="Logo"/>
          </CarouselComp.Caption>
        </CarouselComp.Item>
        <CarouselComp.Item className="carousel-style">
          <img id="f3" className="d-block w-100 fluid" alt="Third slide" />
          <CarouselComp.Caption>
            <img id="logo3" className="d-block w-100 logo-style fluid" alt="Logo" />
          </CarouselComp.Caption>
        </CarouselComp.Item>
      </CarouselComp>
    );
  }
}

export default Carousel;
