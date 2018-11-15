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

class RehearsalEditPage extends Component {
  componentDidMount(){
      if(this.props.isAdmin){
            //This needs to be deferred since the loading of this component happens during a dispatch.
            console.log("ADMIN!");
      } 
      else{
          console.log("NON ADMIN");
      }
      deferredDispatch(loadAllRehearsals());
  }
    render() {
    return (
        <div>
            {this.props.rehearsals.map((obj)=>obj.location)}
        </div>
    );
  }
}

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