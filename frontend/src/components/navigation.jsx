import React, { Component } from "react";
import Logo from '../images/bmnlogo.png';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap/lib';

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
            <NavItem eventKey={1} href="#">
              Home
            </NavItem>
            <NavItem eventKey={2} href="#">
              Rooster
            </NavItem>
            <NavItem eventKey={3} href="#">
              Nummers
            </NavItem>
            <NavItem eventKey={4} href="#">
              Aanwezigheid
            </NavItem>
            <NavDropdown eventKey={5} title="Commissie tools" id="basic-nav-dropdown">
              <MenuItem eventKey={5.1}>Suggesties</MenuItem>
              <MenuItem eventKey={5.2}>Stageplan</MenuItem>
              <MenuItem eventKey={5.3}>Roosters</MenuItem>
              <MenuItem eventKey={5.4}>Tickets</MenuItem>
              <MenuItem eventKey={5.5}>Setlist</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    // <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
    //   <a className="navbar-brand" href="#">
    //     <img className="logo" src={Logo} width="75" />
    //   </a>
    //   <button
    //     className="navbar-toggler"
    //     type="button"
    //     data-toggle="collapse"
    //     data-target="#navbarNavDropdown"
    //     aria-controls="navbarNavDropdown"
    //     aria-expanded="false"
    //     aria-label="Toggle navigation"
    //   >
    //     <span className="navbar-toggler-icon" />
    //   </button>
    //   <div className="collapse navbar-collapse" id="navbarNavDropdown">
    //     <ul className="navbar-nav">
    //       <li className="nav-item">
    //         <a
    //           className={
    //             this.state.active === "home" ? "nav-link active" : "nav-link"
    //           }
    //           href="#"
    //         >
    //           Home
    //           </a>
    //       </li>
    //       <li className="nav-item">
    //         <a
    //           className={
    //             this.state.active === "rooster"
    //               ? "nav-link active"
    //               : "nav-link"
    //           }
    //           href="#"
    //         >
    //           Rooster
    //           </a>
    //       </li>
    //       <li className="nav-item">
    //         <a
    //           className={
    //             this.state.active === "nummers"
    //               ? "nav-link active"
    //               : "nav-link"
    //           }
    //           href="#"
    //         >
    //           Nummers
    //           </a>
    //       </li>
    //       <li className="nav-item">
    //         <a
    //           className={
    //             this.state.active === "aanwezigheid"
    //               ? "nav-link active"
    //               : "nav-link"
    //           }
    //           href="#"
    //         >
    //           Aanwezigheid
    //           </a>
    //       </li>
    //     </ul>
    //   </div>
    //   <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
    //     <ul className="navbar-nav ml-auto">
    //       <li className="nav-item dropdown">
    //         <a
    //           className={
    //             this.state.active === "tools"
    //               ? "nav-link dropdown-toggle active"
    //               : "nav-link dropdown-toggle"
    //           }
    //           href="#"
    //           id="navbarDropdownMenuLink"
    //           data-toggle="dropdown"
    //           aria-haspopup="true"
    //           aria-expanded="false"
    //         >
    //           Commissie Tools
    //           </a>
    //         <div
    //           className="dropdown-menu"
    //           aria-labelledby="navbarDropdownMenuLink"
    //         >
    //           <a className="dropdown-item" href="#">
    //             Suggesties
    //             </a>
    //           <a className="dropdown-item" href="#">
    //             Stageplan
    //             </a>
    //           <a className="dropdown-item" href="#">
    //             Roosters
    //             </a>
    //           <a className="dropdown-item" href="#">
    //             Tickets
    //             </a>
    //           <a className="dropdown-item" href="#">
    //             Setlist
    //             </a>
    //         </div>
    //       </li>
    //       <li className="nav-item">
    //         <a
    //           className={
    //             this.state.active === "instellingen"
    //               ? "nav-link active"
    //               : "nav-link"
    //           }
    //           href="#"
    //         >
    //           Instellingen
    //           </a>
    //       </li>
    //       <li className="nav-item">
    //         <a className="nav-link" href="#">
    //           Logout
    //           </a>
    //       </li>
    //     </ul>
    //   </div>
    // </nav>
    );
  }
}

export default Navigation;
