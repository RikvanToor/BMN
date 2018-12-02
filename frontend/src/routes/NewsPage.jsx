import React, { Component } from "react";
import { PageHeader } from 'react-bootstrap';
import { deferredDispatch } from '@Services/AppDispatcher.js';
import { getNewsAction } from '@Actions/NewsActions.js';
import NewsArticle from '@Components/NewsArticle.jsx';

/**
 * The news page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
class NewsPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.isLoggedIn)
            this.getNews();
    }

    getNews() {
        deferredDispatch(getNewsAction());
    }

    render() {
        return (
            <div>
                <PageHeader>Nieuws</PageHeader>
                {this.props.news.map(x => <NewsArticle key={x.id} article={x} isCommittee={this.props.isCommittee} />)}
            </div>
        )
    }
}

export default NewsPage;