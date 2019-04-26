import React, { PureComponent } from "react";
import Logo from "../images/bmnlogo.png";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

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
        <NavItem key={address} href={address}>
          {text}
        </NavItem>
    );
  }

  render() {
    var navs = [];

    //User only menu parts
    var publicLinks = Object.keys(links).map(key =>
      this.createLink(links[key], key)
    );

    var tickets = this.createPageLink('https://www.a-eskwadraat.nl/Activiteiten/bmn/7693/BtaMusicNight2019/KaartjeKopen?cleanhtml=1', 'Tickets');

    navs = navs.concat(publicLinks, tickets);

    return (
      <Navbar fixedTop collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer to="/">
              <NavItem href="#">
                <img className="logo" src={Logo} />
              </NavItem>
            </LinkContainer>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>{navs}</Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default PublicNavigation;
