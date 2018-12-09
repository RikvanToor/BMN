import React, { PureComponent } from "react";
import { deferredDispatch } from '@Services/AppDispatcher.js';
import { getSongsAction } from '@Actions/SongActions.js';
import { Table, PageHeader } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * The songs page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
 */
class SongsPage extends PureComponent {

  componentDidMount() {
    if (this.props.isLoggedIn)
      deferredDispatch(getSongsAction())
  }

  renderSongsTable(songs) {
    return songs ? <Table striped bordered condensed hover responsive>
      <thead>
        <tr><th>Artiest</th><th>Nummer</th></tr>
      </thead>
      <tbody>
        {songs.map(s => <tr key={s.id}>
          <td>{s.artist}</td>
          <td>
            <LinkContainer to={'/nummer/' + s.id}>
              <a href="#">{s.title}</a>
            </LinkContainer>
          </td>
        </tr>)}
      </tbody>
    </Table> : null;
  }

  render() {
    return <div>
      <PageHeader>Nummers</PageHeader>
      <h2>Mijn nummers</h2>
      {this.renderSongsTable(this.props.mySongs)}
      <h2>Alle nummers</h2>
      {this.renderSongsTable(this.props.songs)}
    </div>;
  }
}

export default SongsPage;