import React, { Component } from "react";
import { PageHeader, Button, Glyphicon } from 'react-bootstrap';
import { deferredDispatch, dispatch } from '@Services/AppDispatcher.js';
import { getNewsAction, createNewsAction } from '@Actions/NewsActions.js';
import { draftToMarkdown } from 'markdown-draft-js';
import { convertToRaw } from 'draft-js';
import NewsArticle from '@Components/NewsArticle.jsx';
import NewsEditor from '@Components/NewsEditor.jsx';
import { ContentState } from 'draft-js';

/**
 * The news page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
*/
class NewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { mode: MODES.NORMAL };
  }

  componentDidMount() {
    if (this.props.isLoggedIn)
      this.getNews();
  }

  setMode(mode) {
    this.transition = undefined;
    this.setState({ mode: mode });
    this.forceUpdate();
  }

  getNews() {
    deferredDispatch(getNewsAction());
  }

  createNewArticle(editState) {
    var content = draftToMarkdown(convertToRaw(editState.editorState.getCurrentContent()));
    var title = editState.title;
    var news = { content, title };
    var action = createNewsAction(news);
    this.transition = MODES.NORMAL;
    dispatch(action);
  }

  renderEditor() {
    var content = ContentState.createFromText('');
    return (this.transition === MODES.NORMAL && this.props.error) || (this.transition !== MODES.NORMAL) ? <NewsEditor 
      content={content} 
      title={''}
      onSave={this.createNewArticle.bind(this)}
      onCancel={() => this.setMode(MODES.NORMAL)}
      error={this.props.error}
      /> : null;
  }

  render() {
    return (
      <div>
        <PageHeader>
          Nieuws
          {this.props.isCommittee ?
            <Button bsStyle="primary" className="pull-right" onClick={() => this.setMode(MODES.NEW)}>
              <Glyphicon glyph='plus' /> Nieuw artikel
            </Button> :
            null}
        </PageHeader>
        {this.props.news.map(x => <NewsArticle key={x.id} article={x} isCommittee={this.props.isCommittee} error={this.props.error} />)}
        {this.state.mode === MODES.NEW ? this.renderEditor() : null}
      </div>
    )
  }
}

const MODES = {
  NORMAL: 'NORMAL',
  NEW: 'NEW'
}

export default NewsPage;