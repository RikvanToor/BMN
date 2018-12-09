import React, { Component } from 'react';
import { Container } from 'flux/utils';
import SongPage from '@Routes/SongPage.jsx';
import SongsStore from '@Stores/SongsStore.js';
import UserStore from '@Stores/UserStore.js';

class SongContainer extends Component {
  static getStores() {
    return [SongsStore, UserStore];
  }
  static calculateState(prevState) {
    return {
      song: SongsStore.song,
      isLoggedIn: UserStore.user.isLoggedIn
    };
  }
  render() {
    return (
      <SongPage
        id={this.props.match.params.id}
        song={this.state.song}
        isLoggedIn={this.state.isLoggedIn}
      />
    );
  }
}

export default Container.create(SongContainer);