import React, { Component } from "react";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <footer className="page-footer bg-dark text-light text-center p-2">
          <p>© Béta Music Night</p>
          <small>
            Is er een probleem met de site? Mail ons dan op bmn@a-eskwadraat.nl
            of spreek iemand van de commissie aan.
          </small>
        </footer>
      </div>
    );
  }
}

export default Footer;
