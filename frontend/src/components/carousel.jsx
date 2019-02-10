import React, { Component } from "react";
import bg1 from "../images/bg_1.jpg";
import bg2 from "../images/bg_2.jpg";
import bg3 from "../images/bg_3.jpg";
import CarouselComp from 'react-bootstrap/lib/Carousel';

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <CarouselComp>
        <CarouselComp.Item>
          <img className="d-block w-100" src={bg1} alt="First slide" />
        </CarouselComp.Item>
        <CarouselComp.Item>
          <img className="d-block w-100" src={bg2} alt="Second slide" />
        </CarouselComp.Item>
        <CarouselComp.Item>
          <img className="d-block w-100" src={bg3} alt="Third slide" />
        </CarouselComp.Item>
      </CarouselComp>
    );
  }
}

export default Carousel;
