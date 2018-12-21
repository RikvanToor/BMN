import React, {Component} from 'react';
import { List } from 'immutable';
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

    getPersonalSchedule() {
        // Deep copy the full rehearsals list
        var list = this.state.rehearsals.map(x => ({...x}));
        list.forEach(x => x.songs = x.songs.filter(y => y.players.find(z => z.id === this.state.userid)));
        return list;
    }

    render() {
        return (
            <RehearsalsPage 
                rehearsals={this.state.rehearsals}
                personalRehearsals={this.getPersonalSchedule()}
                isLoggedIn={this.state.isLoggedIn} 
                userid={this.state.userid}
            />
        );
    }
}

export default Container.create(RehearsalContainer);