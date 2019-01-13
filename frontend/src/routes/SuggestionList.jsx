import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { getSuggestions } from '@Actions/SuggestionsActions.js';
import { Table, PageHeader } from 'react-bootstrap';
import { deferredDispatch } from '@Services/AppDispatcher.js';
import SuggestionsStore from '@Stores/SuggestionsStore.js';

class SuggestionList extends Component {
  componentDidMount() {
    deferredDispatch(getSuggestions());
  }

  static renderSuggestionsTable(songs) {
    return songs ? (
      <Table striped bordered condensed hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Artiest</th>
            <th>Titel</th>
            <th>Genre</th>
            <th>Link</th>
            <th>Suggestie door</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {songs.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.artist}</td>
              <td>{s.title}</td>
              <td>{s.genre}</td>
              <td>{s.spotify_link}</td>
              <td>{s.suggested_by ? s.suggester.name : null}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : null;
  }

  render() {
    return (
      <div className="container pt-5 bg-light">
        <PageHeader>Suggestielijst</PageHeader>
        <div className="form-group mx-sm-3 mb-2">
          <input
            type="text"
            className="form-control"
            id="searchquery"
            placeholder="Search..."
          />
        </div>
        {SuggestionList.renderSuggestionsTable(this.props.suggestions)}
      </div>
    );
  }
}

export default Container.createFunctional(
  state => <SuggestionList suggestions={state.suggestions} />,
  () => [SuggestionsStore],
  (state, props) => ({
    suggestions: SuggestionsStore.suggestions,
  }),
);
