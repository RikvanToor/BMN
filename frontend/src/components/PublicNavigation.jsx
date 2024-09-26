import React, { PureComponent } from "react";
import Logo from "../images/BMN2021.png";
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
        <NavItem key={address} href={address} target="_blank">
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

    var tickets = this.createPageLink('https://www.a-eskwadraat.nl/Activiteiten/bmn/8581/BtaMusicNight2021/KaartjeKopen', 'Tickets');
    //var audities = this.createPageLink('https://forms.gle/g66d8TLx1Y5d6k3v7', 'Audities');
    var interesse = this.createPageLink('https://docs.google.com/forms/d/e/1FAIpQLSfSoILneJkkm5boILW0-_jvIYCI8ss9Xkn4N9-2MYb7FO-iGg/viewform', 'Interesse Audities 2022');

    navs = navs.concat(publicLinks, tickets, interesse);

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
