import React, { Component } from "react";
import Navigation from "./components/navigation.jsx";
import Footer from "./components/footer.jsx";
import SongTable from "./components/songTable.jsx";
import Carousel from "./components/carousel.jsx";
import CSS from './App.css';

class App extends Component {
  render() {
    return (
      <div className="bg-light">
        <Navigation active="tools" />
        <Carousel />
        <div className="container pt-5 bg-light">
          <div className="text-center">
            <h2>Suggesties</h2>
            <p>
              Deze tool helpt bij setlistvergaderingen om makkelijk door de
              suggesties heen te gaan.
            </p>
            <hr />
          </div>
          <div className="form-group mx-sm-3 mb-2">
            <input
              type="text"
              className="form-control"
              id="searchquery"
              placeholder="Search..."
            />
          </div>
          <SongTable />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
