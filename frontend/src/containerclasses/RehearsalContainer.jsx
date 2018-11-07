import React, {Component} from 'react';
import {Container} from 'flux/utils';
import RehearsalsPage from '@Routes/Rehearsals.jsx';
import RehearsalStore from '@Stores/RehearsalStore.js';

class RehearsalContainer extends Component {
    static getStores() { 
        return [RehearsalStore]; 
    } 
    static calculateState(prevState) {
        return {
            rehearsals: RehearsalStore.rehearsals
        }; 
    }
    render() {
        return (
            <RehearsalsPage rehearsals={this.state.rehearsals} />
        );
    }
}

export default Container.create(RehearsalContainer);