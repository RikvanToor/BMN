import React, { Component } from "react";
import { Panel } from 'react-bootstrap';
import MarkdownRenderer from 'react-markdown-renderer';

/**
 * Display for a news article
 */
class NewsArticle extends Component {
  constructor(props) {
    super(props);
    this.state = { article: this.props.article };
  }

  render() {
    return (
      <Panel className='news-article'>
        <h1>{this.state.article.title}</h1>
        <hr />
        <MarkdownRenderer markdown={this.state.article.content}/>
        <hr />
        <p>{this.state.article.writer.name} - {this.state.article.created_at}</p>
      </Panel>
    )
  }
}

export default NewsArticle;