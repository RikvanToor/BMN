import React, { Component } from 'react';
import Navigation from '@Components/navigation.jsx';
import UserStore from '@Stores/UserStore.js';
import { Container } from 'flux/utils';

class NavigationContainer extends Component {
    static getStores() {
        return [UserStore];
    }
    static calculateState(prevState) {
        return {
            isCommittee: UserStore.user.isCommittee
        };
    }
    render() {
        return (
            <Navigation isCommittee={this.state.isComittee} />
        );
    }
}

export default Container.create(NavigationContainer);
