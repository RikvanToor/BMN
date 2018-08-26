import React, { Component } from "react";
import Carousel from "../components/carousel.jsx";

class Home extends Component {
  render() {
    return (
        <div>
            <Carousel />
            <h1>I'm home!</h1>
        </div>
    );
  }
}

export default Home;
