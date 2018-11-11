import React, {Component} from 'react';
import {Container} from 'flux/utils';
import RehearsalsPage from '@Routes/Rehearsals.jsx';
import RehearsalStore from '@Stores/RehearsalStore.js';
import UserStore from '@Stores/UserStore.js';

class RehearsalContainer extends Component {
    static getStores() { 
        return [RehearsalStore, UserStore]; 
    } 
    static calculateState(prevState) {
        return {
            rehearsals: RehearsalStore.rehearsals,
            isLoggedIn: UserStore.user.isLoggedIn,
            userid: UserStore.user.id
        }; 
    }
    render() {
        return (
            <RehearsalsPage 
                rehearsals={this.state.rehearsals} 
                isLoggedIn={this.state.isLoggedIn} 
                userid={this.state.userid}
            />
        );
    }
}

export default Container.create(RehearsalContainer);