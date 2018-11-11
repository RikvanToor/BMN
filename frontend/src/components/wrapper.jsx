import React, { Component } from "react";
import Footer from "./footer.jsx";
import LoginContainer from "@Containers/LoginContainer.jsx";
import NavigationContainer from "@Containers/NavigationContainer.jsx";
import RehearsalContainer from '@Containers/RehearsalContainer.jsx';
import ParticipantHome from "@Routes/ParticipantHome.jsx";
import { BrowserRouter, Route } from "react-router-dom";
import { Grid, Row } from 'react-bootstrap';

/**
 * Main routes in the application
 */
import Home from '@Routes/Home.jsx';
import SuggestionList from '@Routes/SuggestionList.jsx';

class Wrapper extends Component {
    render() {
        return this.props.ReadyToRender ? (
            <BrowserRouter>
                <div className="bg-light">
                    <NavigationContainer />
                    <Grid>
                        <Row>
                            <Route exact path="/home" component={Home} />
                            <Route exact path="/rooster" component={RehearsalContainer} />
                            <Route exact path="/suggesties" component={SuggestionList} />
                            <Route exact path="/login" component={LoginContainer} />
                            <Route exact path="/homeParticipant" component={ParticipantHome} />
                        </Row>
                    </Grid>
                    <Footer />
                </div>
            </BrowserRouter>
        ) : null;
    }
}

export default Wrapper;