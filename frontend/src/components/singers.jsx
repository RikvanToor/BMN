import React, { Component } from "react";
import Singer from "./singer.jsx";
import { ButtonGroup } from 'react-bootstrap';

class Singers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ButtonGroup>
        <Singer initials="DC" color="0" />
        <Singer initials="HdH" color="0" />
        <Singer initials="HN" color="1" />
        <Singer initials="JL" color="2" />
        <Singer initials="MB" color="0" />
        <Singer initials="MS" color="2" />
        <Singer initials="MW" color="0" />
        <Singer initials="RM" color="2" />
        <Singer initials="SV" color="2" />
      </ButtonGroup>
    );
  }
}

export default Singers;
