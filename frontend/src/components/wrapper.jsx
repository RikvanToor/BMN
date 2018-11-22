import React, { Component } from "react";
import Footer from "./footer.jsx";
import NewsContainer from '@Containers/NewsContainer.jsx';
import LoginContainer from "@Containers/LoginContainer.jsx";
import NavigationContainer from "@Containers/NavigationContainer.jsx";
import RehearsalContainer from '@Containers/RehearsalContainer.jsx';
import AvailabilityContainer from '@Containers/AvailabilityContainer.jsx';
import ParticipantHome from "@Routes/ParticipantHome.jsx";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
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
                            <Route exact path="/" component={NewsContainer} />
                            <Route exact path="/nieuws" component={NewsContainer} />
                            <Route exact path="/rooster" component={RehearsalContainer} />
                            <Route exact path="/suggesties" component={SuggestionList} />
                            <Route exact path="/login" component={LoginContainer} />
                            <Route exact path="/homeParticipant" component={ParticipantHome} />
                            <Route exact path="/aanwezigheid" component={AvailabilityContainer} />
                        </Row>
                    </Grid>
                    <Footer />
                </div>
            </BrowserRouter>
        ) : null;
    }
}

export default Wrapper;