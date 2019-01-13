import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { getSuggestions, removeSuggestion } from '@Actions/SuggestionsActions.js';
import { Table, PageHeader } from 'react-bootstrap';
import { deferredDispatch } from '@Services/AppDispatcher.js';
import SuggestionsStore from '@Stores/SuggestionsStore.js';

class SuggestionList extends Component {
  componentDidMount() {
    deferredDispatch(getSuggestions());
  }

  removeSuggestion(index){

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
          </tr>
        </thead>
        <tbody>
          {songs.map((s, index) => (
            <tr key={s.id}>
              <td>{index + 1}</td>
              <td>{s.artist}</td>
              <td>{s.title}</td>
              <td>{s.genre}</td>
              <td><a href={s.spotify_link}>Play</a></td>
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
