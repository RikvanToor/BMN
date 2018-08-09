import React, { Component } from "react";
import Logo from '../images/bmnlogo.png';

class Navigation extends Component {
  state = { active: this.props.active };

  render() {
    return (
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">
          <img className="logo" src={Logo} width="75" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className={
                  this.state.active === "home" ? "nav-link active" : "nav-link"
                }
                href="#"
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  this.state.active === "rooster"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="#"
              >
                Rooster
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  this.state.active === "nummers"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="#"
              >
                Nummers
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  this.state.active === "aanwezigheid"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="#"
              >
                Aanwezigheid
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <a
                className={
                  this.state.active === "tools"
                    ? "nav-link dropdown-toggle active"
                    : "nav-link dropdown-toggle"
                }
                href="#"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Commissie Tools
              </a>
              <div
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <a className="dropdown-item" href="#">
                  Suggesties
                </a>
                <a className="dropdown-item" href="#">
                  Stageplan
                </a>
                <a className="dropdown-item" href="#">
                  Roosters
                </a>
                <a className="dropdown-item" href="#">
                  Tickets
                </a>
                <a className="dropdown-item" href="#">
                  Setlist
                </a>
              </div>
            </li>
            <li className="nav-item">
              <a
                className={
                  this.state.active === "instellingen"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="#"
              >
                Instellingen
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navigation;
