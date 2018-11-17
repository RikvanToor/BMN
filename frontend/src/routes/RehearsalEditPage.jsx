//React library imports
import React, { Component } from "react";
import PropTypes from 'prop-types';

//UI imports
import Carousel from "../components/carousel.jsx";
import ConditionalComponent from '@Components/ConditionalComponent.jsx';

//Data imports
import {Container} from 'flux/utils';
import UserStore from '@Stores/UserStore.js';
import {deferredDispatch} from '@Services/AppDispatcher.js';
import RehearsalManipulationStore, {loadAllRehearsals} from '@Stores/RehearsalManipulationStore.js';
import * as typeChecks from '@Utils/TypeChecks.js';
import ConditionalComponet from '@Components/ConditionalComponent.jsx';
import {ButtonToolbar, ButtonGroup, Button, Glyphicon, Table, Checkbox} from 'react-bootstrap';
import RehearsalForm from '@Components/RehearsalForm.jsx';

//Datetime formatting functions
import {readableDate, readableTime} from '@Utils/DateTimeUtils.js';

class RehearsalEditPage extends Component {
  constructor(props){
    super(props);
    this.state = {showRehearsalDayForm:true, selectedRehearsalDays:new Set()};
  }
  componentDidMount(){
      deferredDispatch(loadAllRehearsals());
  }
  selectRehearsal(e, id){
    let add = e.target.checked;
    let set = this.state.selectedRehearsalDays;
    if(add){
      set.add(id);
    }
    else{
      set.delete(id);
    }
    this.setState({selectedRehearsalDays:set});
  }
    render() {
    return (
        <div>
          <h1>Repetitiedagen</h1>
          <ButtonToolbar>
            <ButtonGroup>
            <Button><Glyphicon glyph="plus" style={{color:'green'}}/>Nieuwe repetitiedag</Button>
              <Button><Glyphicon glyph="minus" style={{color:'red'}}/>Verwijder repetitiedag</Button>
            </ButtonGroup>
          </ButtonToolbar>
          <ConditionalComponent condition={this.state.showRehearsalDayForm}>
            <RehearsalForm/>
          </ConditionalComponent>
          <Table striped bordered condensed hover responsive>
            <thead>
                <tr>
                  <th>#</th>
                  <th>Datum</th>
                  <th>Locatie</th>
                  <th>Begintijd</th>
                  <th>Eindtijd</th>
                </tr>
            </thead>
            <tbody>
              {
                this.props.rehearsals.map((obj)=>(
                  <tr key={obj.start}>
                    <td><Checkbox checked={this.state.selectedRehearsalDays.has(obj.id)} onChange={(e)=>this.selectRehearsal(e,obj.id)}/></td>
                    <td>{readableDate(new Date(obj.start))}</td>
                    <td>{obj.location}</td>
                    <td>{readableTime(new Date(obj.start))}</td>
                    <td>{readableTime(new Date(obj.end))}</td>
                  </tr>     
                ))
              }
            </tbody>
          </Table>
            {this.props.rehearsals.map((obj)=>obj.location)}
        </div>
    );
  }
};

//Setup proptypes for development checking
RehearsalEditPage.propTypes = {
  isAdmin: PropTypes.bool.isRequired  
};

//Wrap the page in a Flux container that relays data from stores
export default Container.createFunctional(
    (state)=>(<RehearsalEditPage isAdmin={state.isAdmin} rehearsals={state.rehearsals}/>), //View function
    
    ()=>[UserStore, RehearsalManipulationStore], //Required stores
    
    (prevState)=>{ //Determine the state needed
        return {isAdmin: UserStore.user.isCommittee, rehearsals: RehearsalManipulationStore.rehearsals};
    }
);