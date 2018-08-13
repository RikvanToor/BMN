import React, { Component } from "react";

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
    let result = "btn p-1 ";

    switch (parseInt(this.state.color)) {
      case 0:
        result += "btn-success";
        break;
      case 1:
        result += "btn-warning";
        break;
      case 2:
        result += "btn-danger";
        break;
      default:
        result += "btn-secondary";
        break;
    }

    return result;
  }

  render() {
    return (
      <button
        className={this.color()}
        onClick={this.handleSwitch}
        style={{ outline: "none" }}
      >
        {this.props.initials}
      </button>
    );
  }
}

export default Singer;
