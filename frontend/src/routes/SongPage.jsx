import React, { PureComponent } from "react";
import { deferredDispatch } from '@Services/AppDispatcher.js';
import { getSongAction } from '@Actions/SongActions.js';
import { Table, PageHeader, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * The song (singular) page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
 */
class SongsPage extends PureComponent {

  componentDidMount() {
    if (this.props.isLoggedIn)
      deferredDispatch(getSongAction(this.props.id))
  }

  render() {
    return <div>
      {this.props.song ?
        <div>
          <PageHeader>{this.props.song.artist} - {this.props.song.title}</PageHeader>
          <h3>{this.props.song.genre}</h3>
          <Col xs={12} md={8}>
            <Table striped bordered condensed hover responsive>
              <thead>
                <tr>
                  <th>Deelnemer</th>
                  <th>Instrument</th>
                </tr>
              </thead>
              <tbody>
                {this.props.song.players.map(s => <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.pivot.instrument}</td>
                </tr>)}
              </tbody>
            </Table>
          </Col>
          <Col xs={12} md={4}>
            {this.props.song.comment ? <p>{this.props.song.comment}</p> : null}
            <p><a href={this.props.song.spotify_link}>Luister op Spotify</a></p>
          </Col>
        </div> : ''}
    </div>;
  }
}

export default SongsPage;