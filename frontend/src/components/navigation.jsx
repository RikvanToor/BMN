import React, { PureComponent } from "react";
import Logo from '../images/bmnlogo.png';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap/lib';
import { Redirect } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { dispatch} from '@Services/AppDispatcher.js';
import {logOut} from '@Actions/UserActions.js';

const userLinks = {
  'Nieuws' : 'nieuws',
  'Rooster' : 'rooster',
  'Nummers' : 'nummers',
  'Aanwezigheid' : 'aanwezigheid',
  'Account' : 'account'
};
const committeeLinks = {
  'Suggesties' : 'suggesties',
  'Stageplan' : 'stageplan',
  'Roosters' :'roosterAanpassen',
  'Tickets' : 'tickets',
  'Setlist' : 'setlist',
  'Gebuikersbeheer' : 'gebruikersbeheer'
};

/**
 * Navigation class, rendered as a menubar at the top of the site
 */
class Navigation extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { active: this.props.active };
        this.logOutUser = this.logOutUser.bind(this);
    }

    createLink(address, text) {
        return (
            <LinkContainer key={address} to={'/' + address}>
                <NavItem key={address} href="#">{text}</NavItem>
            </LinkContainer>
        );
    }
    createMenuItem(address, text){
      return (
        <LinkContainer to={"/"+address} key={address}>
          <MenuItem >{text}</MenuItem>
        </LinkContainer>
      );
    }
    logOutUser(){
      dispatch(logOut());
    }

    render() {
        var navs = [];
        
        //User only menu parts
        var usersOnly = Object.keys(userLinks).map(key=>this.createLink(userLinks[key],key));
        
        var committeeOnly = (
            <NavDropdown key="committee" eventKey={5} title="Commissie tools" id="basic-nav-dropdown">
                {Object.keys(committeeLinks).map(key=>this.createMenuItem(committeeLinks[key],key))}
            </NavDropdown>
        );

        if (this.props.isLoggedIn) {
            navs = navs.concat(usersOnly);
            if (this.props.isCommittee) {
                navs.push(committeeOnly);
            }
            navs = navs.concat(<NavItem key="logOut" onClick={this.logOutUser}>Log uit</NavItem>);
        }
        else {
            navs.push(this.createLink('login', 'Log In'));
        }

        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <LinkContainer to='/'>
                            <NavItem href="#">
                                <img className="logo" src={Logo} />
                            </NavItem>
                        </LinkContainer>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        {navs}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Navigation;
