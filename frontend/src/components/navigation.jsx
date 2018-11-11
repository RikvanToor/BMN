import React, { PureComponent } from "react";
import Logo from '../images/bmnlogo.png';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap/lib';
import { Redirect } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * Navigation class, rendered as a menubar at the top of the site
 */
class Navigation extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { active: this.props.active };
    }

    createLink(address, text) {
        return (
            <LinkContainer key={address} to={'/' + address}>
                <NavItem key={address} href="#">{text}</NavItem>
            </LinkContainer>
        );
    }

    render() {
        var navs = [];
        var usersOnly = [
            this.createLink('home', 'Home'),
            this.createLink('rooster', 'Rooster'),
            this.createLink('nummers', 'Nummers'),
            this.createLink('aanwezigheid', 'Aanwezigheid')
        ];
        var committeeOnly = (
            <NavDropdown key="committee" eventKey={5} title="Commissie tools" id="basic-nav-dropdown">
                <LinkContainer to="/suggesties">
                    <MenuItem eventKey={5.1}>Suggesties</MenuItem>
                </LinkContainer>
                <MenuItem eventKey={5.2}>Stageplan</MenuItem>
                <MenuItem eventKey={5.3}>Roosters</MenuItem>
                <MenuItem eventKey={5.4}>Tickets</MenuItem>
                <MenuItem eventKey={5.5}>Setlist</MenuItem>
            </NavDropdown>
        );

        if (this.props.isLoggedIn) {
            navs = navs.concat(usersOnly);
            if (this.props.isCommittee) {
                navs.push(committeeOnly);
            }
        }
        else {
            navs.push(this.createLink('login', 'Log In'));
            navs.push(<Redirect key="redirect" to='/login' />);
        }

        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <LinkContainer to='/home'>
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
