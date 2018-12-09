import React, {Component} from 'react';
import {Container} from 'flux/utils';
import SongsPage from '@Routes/SongsPage.jsx';
import SongsStore from '@Stores/SongsStore.js';
import UserStore from '@Stores/UserStore.js';

class SongsContainer extends Component {
  static getStores() { 
      return [SongsStore, UserStore]; 
  } 
  static calculateState(prevState) {
      return {
          mySongs: SongsStore.mySongs,
          songs: SongsStore.songs,
          isLoggedIn: UserStore.user.isLoggedIn
      }; 
  }
  render() {
      return (
          <SongsPage 
              mySongs={this.state.mySongs}
              songs={this.state.songs} 
              isLoggedIn={this.state.isLoggedIn} 
          />
      );
  }
}

export default Container.create(SongsContainer);