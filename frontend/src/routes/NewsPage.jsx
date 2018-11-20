import React, { Component } from "react";
import { deferredDispatch } from '@Services/AppDispatcher.js';
import { getNewsAction } from '@Actions/NewsActions.js';
import NewsArticle from '../components/NewsArticle.jsx';

/**
 * The news page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
class NewsPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
      console.log(this.props);
        if (this.props.isLoggedIn)
            this.getNews();
    }

    getNews() {
        deferredDispatch(getNewsAction());
    }

    render() {
        return (
            <div>
                {this.props.news.map(x => <NewsArticle key={x.id} article={x} />)}
            </div>
        )
    }
}

export default NewsPage;