import React, { PureComponent } from "react";
import Logo from "../images/bmnlogo.png";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap/lib";
import { Redirect } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { dispatch } from "@Services/AppDispatcher.js";
import { logOut } from "@Actions/UserActions.js";

const links = {
  'Home': 'root',
  'Info': 'info',
  'Foto\'s': 'fotos',
};

/**
 * Navigation class, rendered as a menubar at the top of the site
 */
class PublicNavigation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { active: this.props.active };
  }

  createLink(address, text) {
    return (
      <LinkContainer key={address} to={"#" + address}>
        <NavItem key={address} href="#">
          {text}
        </NavItem>
      </LinkContainer>
    );
  }

  createPageLink(address, text) {
    return (
      <LinkContainer key={address} to={address}>
        <NavItem key={address} href="#">
          {text}
        </NavItem>
      </LinkContainer>
    );
  }

  render() {
    var navs = [];

    //User only menu parts
    var publicLinks = Object.keys(links).map(key =>
      this.createLink(links[key], key)
    );

    var tickets = this.createPageLink('tickets', 'Tickets');

    navs = navs.concat(publicLinks, tickets);

    return (
      <Navbar className="navbar-fixed-top collapseOnSelect">
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer to="/">
              <NavItem href="#">
                <img className="logo" src={Logo} />
              </NavItem>
            </LinkContainer>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>{navs}</Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default PublicNavigation;
