//React library imports
import React, { Component } from "react";
import PropTypes from 'prop-types';

//UI imports
import Carousel from "../components/carousel.jsx";
import ConditionalComponent from '@Components/ConditionalComponent.jsx';
import ConditionalComponet from '@Components/ConditionalComponent.jsx';
import { ButtonToolbar, ButtonGroup, Button, Glyphicon, Table, Checkbox } from 'react-bootstrap';
import RehearsalForm from '@Components/RehearsalForm.jsx';
import RehearsalSongsForm from '@Components/RehearsalSongsForm.jsx';

//Data imports
import { Container } from 'flux/utils';
import UserStore from '@Stores/UserStore.js';
import { deferredDispatch, dispatch } from '@Services/AppDispatcher.js';
import RehearsalManipulationStore, { loadAllRehearsals } from '@Stores/RehearsalManipulationStore.js';
import RehearsalStore from '@Stores/RehearsalStore.js';
import { getScheduleAction, createRehearsals, deleteRehearsals, getAllAvailabilities } from '@Actions/RehearsalActions.js';

class Home extends Component {
  super(props) {
    this.state = {

    };
  }

  componentDidMount() {
    deferredDispatch(getAllAvailabilities());
  }

  render() {
    return (
      <div>
        <Table striped bordered condensed hover responsive style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>Naam</th>
              <th>Datum</th>
              <th>Beschikbaarheid</th>
            </tr>
          </thead>
          <tbody />
        </Table>
      </div>
    );
  }
}

export default Home;
