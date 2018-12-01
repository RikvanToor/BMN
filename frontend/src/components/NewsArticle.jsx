import React, { Component } from "react";
import { Panel, Glyphicon, Button } from 'react-bootstrap';
import MarkdownRenderer from 'react-markdown-renderer';
import { printDateTime } from '../GeneralExtensions.js';
import { RichEditor } from './RichEditor.jsx';

/**
 * Display for a news article
 */
class NewsArticle extends Component {
  constructor(props) {
    super(props);
    this.state = { article: this.props.article };
  }

  editBar() {
    if(this.props.isCommittee) {
      return <div className='news-article-controls'>
        <Button>
          <Glyphicon glyph='pencil' />
        </Button>
        <Button>
          <Glyphicon glyph='remove' />
        </Button>
      </div>;
    }
    return '';
  }

  render() {
    return (
      <Panel className='news-article'>
        <h1>{this.state.article.title}</h1>
        <hr />
        <MarkdownRenderer markdown={this.state.article.content}/>
        <hr />
        <p className='author-information'>{this.state.article.writer.name} - {printDateTime(new Date(this.state.article.created_at))}</p>
        {this.editBar()}
      </Panel>
    )
  }
}

export default NewsArticle;