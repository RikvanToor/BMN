//React library imports
import React, { Component } from "react";
import PropTypes from 'prop-types';

//UI imports
import Carousel from "../components/carousel.jsx";
import ConditionalComponent from '@Components/ConditionalComponent.jsx';
import ConditionalComponet from '@Components/ConditionalComponent.jsx';
import { ButtonToolbar, ButtonGroup, Button, Glyphicon, Table, Checkbox } from 'react-bootstrap';
import RehearsalForm from '@Components/RehearsalComponents/RehearsalForm.jsx';
import RehearsalSongsForm from '@Components/RehearsalComponents/RehearsalSongsForm.jsx';

//Data imports
import { Container } from 'flux/utils';
import UserStore from '@Stores/UserStore.js';
import { deferredDispatch, dispatch } from '@Services/AppDispatcher.js';
import RehearsalManipulationStore, { loadAllRehearsals } from '@Stores/RehearsalManipulationStore.js';
import RehearsalStore from '@Stores/RehearsalStore.js';
import { getScheduleAction, createRehearsals, deleteRehearsals, getAllAvailabilities } from '@Actions/RehearsalActions.js';
import {printTime} from '../GeneralExtensions.js';

class CheckAvailabilityPage extends Component {
  componentDidMount() {
    deferredDispatch(getAllAvailabilities());
  }
  getAvailabilitiesPerUser(availabilities){
    let users = {};
    availabilities.forEach((el)=>{
      if(!(el.id in users)){
        users[el.id] = [];
      }
      users[el.id].push(el);
    });
    return users;
  }
  renderAvailabilities(rehearsalObj){
    let startTime = new Date(rehearsalObj.start);
    let endTime = new Date(rehearsalObj.end);
    let availPerUser = this.getAvailabilitiesPerUser(rehearsalObj.availabilities);
    return (
      <div key={rehearsalObj.location+rehearsalObj.start}>
        <h3>{startTime.toLocaleDateString('nl-nl', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
        <h4>{printTime(startTime)}-{printTime(endTime)} @ {rehearsalObj.location}</h4>
        <Table striped bordered condensed hover responsive style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>Naam</th>
              <th>Beschikbaarheid</th>
            </tr>
          </thead>
          <tbody>
              {
                Object.keys(availPerUser).map((key)=>{
                  let av = availPerUser[key];
                  let str = av.map((el)=>{
                    return printTime(el.start)+'-'+printTime(el.end);
                  }).join(', ');
                  return(
                    <tr key={av[0].name}>
                      <td>{av[0].name}</td>
                      <td>{str}</td>
                    </tr>
                  );
                })
              }
          </tbody>
        </Table>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.props.rehearsals.map(rehearsal=>this.renderAvailabilities(rehearsal))}
      </div>
    );
  }
}

export default Container.createFunctional(
  (state)=><CheckAvailabilityPage rehearsals={state.rehearsals} />,
  ()=>[RehearsalStore],
  (prevState)=>{
    return {
      rehearsals: RehearsalStore.allAvailabilities
    };
  }
);
