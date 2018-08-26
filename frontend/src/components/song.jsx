import React, { Component } from "react";
import Singers from "./singers.jsx";

class Song extends Component {
  render() {
    return (
      <tr>
        <td className="align-middle pl-2">{this.props.title}</td>
        <td className="align-middle">{this.props.artist}</td>
        <td className="align-middle">{this.props.genre}</td>
        <td className="align-middle">{this.props.vocals}</td>
        <td className="align-middle">
          <a href={this.props.link}>Youtube</a>
        </td>
        <td className="align-middle">
          <Singers />
        </td>
        <td className="align-middle">
          <button
            type="button"
            className="close align-middle"
            aria-label="Close"
            title="Delete"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </td>
      </tr>
    );
  }
}

export default Song;
