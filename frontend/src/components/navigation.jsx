import React, { Component } from "react";
import Logo from '../images/bmnlogo.png';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap/lib';
import {Link} from "react-router-dom";
import {LinkContainer} from 'react-router-bootstrap';

/**
 * Navigation class, rendered as a menubar at the top of the site
 */
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = { active: this.props.active };
  }
  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#brand">
              <img className="logo" src={Logo} width="75" />
            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/home">
                <NavItem eventKey={1} href="#">
                    Home
                </NavItem>
            </LinkContainer>
            <LinkContainer to="/rooster">
                <NavItem eventKey={1} href="#">
                    Rooster
                </NavItem>
            </LinkContainer>
            <LinkContainer to="/nummers">
                <NavItem eventKey={1} href="#">
                    Nummers
                </NavItem>
            </LinkContainer>
            <LinkContainer to="/aanwezigheid">
                <NavItem eventKey={4} href="#">
                    Aanwezigheid
                </NavItem>
            </LinkContainer>
            <NavDropdown eventKey={5} title="Commissie tools" id="basic-nav-dropdown">
                <LinkContainer to="/suggesties">
                    <MenuItem eventKey={5.1}>Suggesties</MenuItem>
                </LinkContainer>
              <MenuItem eventKey={5.2}>Stageplan</MenuItem>
              <MenuItem eventKey={5.3}>Roosters</MenuItem>
              <MenuItem eventKey={5.4}>Tickets</MenuItem>
              <MenuItem eventKey={5.5}>Setlist</MenuItem>
            </NavDropdown>
            <LinkContainer to="/login">
                <NavItem eventKey={4} href="#">
                    Log In
                </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Navigation;
