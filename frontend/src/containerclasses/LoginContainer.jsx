import React, {Component} from 'react';
import LoginPage from '@Routes/LoginPage.jsx';
import UserStore from '@Stores/UserStore.js';
import {Container} from 'flux/utils';

class LoginContainer extends Component {
    static getStores() { 
        return [UserStore]; 
    } 
    static calculateState(prevState) { 
        return {
            isLoggedIn: UserStore.user.isLoggedIn
        }; 
    }
    render() {
        return (
            <LoginPage isLoggedIn={this.state.isLoggedIn} />
        );
    }
}

export default Container.create(LoginContainer);
