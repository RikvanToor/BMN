import React, { Component } from "react";
import Singer from "./singer.jsx";

class Singers extends Component {
  state = {};

  render() {
    return (
      <div className="btn-group" role="group" aria-label="Singers">
        <Singer initials="DC" color="0" />
        <Singer initials="HdH" color="0" />
        <Singer initials="HN" color="1" />
        <Singer initials="JL" color="2" />
        <Singer initials="MB" color="0" />
        <Singer initials="MS" color="2" />
        <Singer initials="MW" color="0" />
        <Singer initials="RM" color="2" />
        <Singer initials="SV" color="2" />
      </div>
    );
  }
}

export default Singers;
