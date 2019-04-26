import React, { Component } from "react";
import Song from "./song.jsx";
import { Table } from 'react-bootstrap';

class SongTable extends Component {
  render() {
    return (
      <div>
        <Table striped hover responsive>
          <thead className="thead-dark">
            <tr>
              <th scope="col" className="pl-2 align-middle">
                <a
                  href="#"
                  className="text-white"
                  style={{ textDecoration: "none" }}
                >
                  Title
                </a>
              </th>
              <th scope="col" className="align-middle">
                <a
                  href="#"
                  className="text-white"
                  style={{ textDecoration: "none" }}
                >
                  Artist
                </a>
              </th>
              <th scope="col" className="align-middle">
                <a
                  href="#"
                  className="text-white"
                  style={{ textDecoration: "none" }}
                >
                  Genre
                </a>
              </th>
              <th scope="col" className="align-middle">
                M/V
              </th>
              <th scope="col" className="align-middle">
                Link
              </th>
              <th scope="col" className="align-middle">
                Vocalists
              </th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            <Song
              title="Shut up and dance"
              artist="Walk the Moon"
              genre="Alternative/Indie, Rock"
              vocals="M"
              link="https://www.youtube.com/watch?v=MgUIlh2h7CQ"
            />
            <Song />
            <Song />
            <Song />
            <Song />
            <Song />
            <Song />
            <Song />
            <Song />
          </tbody>
        </Table>
      </div>
    );
  }
}

export default SongTable;
