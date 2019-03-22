//React library imports
import React, { Component } from "react";

//UI imports
import { Table } from 'react-bootstrap';

//Data imports
import { Container } from 'flux/utils';
import { deferredDispatch } from '@Services/AppDispatcher.js';
import RehearsalStore from '@Stores/RehearsalStore.js';
import { getAllAvailabilities } from '@Actions/RehearsalActions.js';
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
        <h4>Boefjes</h4>
        {(rehearsalObj.boefjes.map((x) => x.name)).join(', ')}
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
                        let now = new Date();
                        if(el.start < now) {
                          return (el.reason);
                        } else {
                          return printTime(el.start)+'-'+printTime(el.end);
                        }
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
