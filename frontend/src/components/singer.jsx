import React, { Component } from "react";
import { Button } from 'react-bootstrap';

class Singer extends Component {
  constructor(props) {
    super(props);
    this.state = { color: this.props.color };
  }
  handleSwitch() {
    if (parseInt(this.state.color) === 2) this.setState({ color: 0 });
    else this.setState({ color: parseInt(this.state.color) + 1 });
  };

  color() {
    let result;

    switch (parseInt(this.state.color)) {
      case 0:
        result= "success";
        break;
      case 1:
        result= "warning";
        break;
      case 2:
        result= "danger";
        break;
      default:
        result= "info";
        break;
    }

    return result + " p-1";
  }

  render() {
    return (
      <Button
        bsStyle={this.color()}
        onClick={this.handleSwitch.bind(this)}
        style={{ outline: "none" }}
      >
        {this.props.initials}
      </Button>
    );
  }
}

export default Singer;
