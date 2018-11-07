import React, { Component } from "react";
import Navigation from "./components/navigation.jsx";
import Footer from "./components/footer.jsx";
import SongTable from "./components/songTable.jsx";
import CSS from './App.css';
import LoginContainer from "@Containers/LoginContainer.jsx";
import NavigationContainer from "@Containers/NavigationContainer.jsx";
import RehearsalContainer from '@Containers/RehearsalContainer.jsx';
import ParticipantHome from "@Routes/ParticipantHome.jsx";
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
            <Route exact path="/rooster" component={RehearsalContainer}/>
            <Route exact path="/suggesties" component={SuggestionList}/>
            <Route exact path="/login" component={LoginContainer}/>
            <Route exact path="/homeParticipant" component={ParticipantHome}/>
            <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
