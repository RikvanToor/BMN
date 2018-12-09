import React, { Component } from 'react';
import { Container } from 'flux/utils';
import NewsPage from '@Routes/NewsPage.jsx';
import NewsStore from '@Stores/NewsStore.js';
import UserStore from '@Stores/UserStore.js';

class NewsContainer extends Component {
  constructor(props) {
    super(props);
  }

  static getStores() {
    return [NewsStore, UserStore];
  }

  static calculateState(prevState) {
    return {
      news: NewsStore.news,
      error: NewsStore.error,
      isCommittee: UserStore.user.isCommittee,
      isLoggedIn: UserStore.user.isLoggedIn
    };
  }

  render() {
    return (
      <NewsPage
        news={this.state.news}
        error={this.state.error}
        isCommittee={this.state.isCommittee}
        isLoggedIn={this.state.isLoggedIn}
      />
    );
  }
}

export default Container.create(NewsContainer);