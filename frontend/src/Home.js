import React, { Component } from "react";
import Navigation from "./components/navigation.jsx";
import Footer from "./components/footer.jsx";
import Carousel from "./components/carousel.jsx";

class Home extends Component {
  render() {
    return (
      <div className="bg-light">
        <Navigation />
        <Carousel />
        <Footer />
      </div>
    );
  }
}

export default Home;
