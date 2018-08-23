import React, { Component } from "react";
import Navigation from "./components/navigation.jsx";
import Footer from "./components/footer.jsx";
import SongTable from "./components/songTable.jsx";
import Carousel from "./components/carousel.jsx";
import CSS from './App.css';
import LoginPage from "@Routes/LoginPage.jsx";
import NavigationContainer from "@Containers/NavigationContainer.jsx";
import {BrowserRouter, Route} from "react-router-dom";

/**
 * Main routes in the application
 */
import Home from '@Routes/Home.jsx';
import SuggestionList from '@Routes/SuggestionList.jsx';

/*
 * Main entry point of the BMN frontend.
 */
class App extends Component {
  render() {
    return (
     <BrowserRouter>
        <div className="bg-light">
            <NavigationContainer/>
            <Route exact path="/home" component={Home}/>
            <Route exact path="/suggesties" component={SuggestionList}/>
            <Route exact path="/login" component={LoginPage}/>
            <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
