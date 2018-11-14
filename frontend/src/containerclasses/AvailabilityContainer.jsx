import React, {Component} from 'react';
import RehearsalStore from '@Stores/RehearsalStore.js';
import UserStore from '@Stores/UserStore.js';
import {Container} from 'flux/utils';
import AvailabilityPage from '@Routes/Availability.jsx';

class AvailabilityContainer extends Component {
    static getStores() { 
        return [RehearsalStore, UserStore]; 
    } 
    static calculateState(prevState) { 
        return {
            availabilities: RehearsalStore.myAvailabilities,
            isLoggedIn: UserStore.user.isLoggedIn,
            userid: UserStore.user.id
        }; 
    }
    render() {
        return (
            <AvailabilityPage 
                availabilities={this.state.availabilities}
                isLoggedIn={this.state.isLoggedIn}
                userid={this.state.userid}
            />
        );
    }
}

export default Container.create(AvailabilityContainer);
