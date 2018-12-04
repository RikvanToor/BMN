import React, { Component } from "react";
import { Panel, Glyphicon, Button, Modal } from 'react-bootstrap';
import MarkdownRenderer from 'react-markdown-renderer';
import { printDateTime } from '../GeneralExtensions.js';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { convertToRaw, convertFromRaw } from 'draft-js';
import { editNewsAction, deleteNewsAction } from '@Actions/NewsActions.js';
import { dispatch } from '@Services/AppDispatcher.js';
import NewsEditor from '@Components/NewsEditor.jsx';

/**
 * Display for a news article
 */
class NewsArticle extends Component {
  constructor(props) {
    super(props);
    this.state = { mode: this.props.article ? MODES.NORMAL : MODES.EDIT };
  }

  /**
   * Sets the current mode and updates the component
   * @param {Mode} mode 
   */
  setMode(mode) {
    this.state.mode = mode;
    this.forceUpdate();
  }

  /**
   * Dispatches an action to update the article from the editor
   */
  saveArticle(editState) {
    var content = draftToMarkdown(convertToRaw(editState.editorState.getCurrentContent()));
    var title = editState.title;
    var news = { content, title };
    var action = editNewsAction(this.props.article.id, news);
    this.setState({ mode: MODES.NORMAL });
    dispatch(action);
  }

  /**
   * Dispatches an action to delete the current article
   */
  deleteArticle() {
    var action = deleteNewsAction(this.props.article.id);
    this.setState({ mode: MODES.NORMAL });
    dispatch(action);
  }

  /**
   * Renders an 'edit' and a 'delete' button
   */
  editBar() {
    if (this.props.isCommittee) {
      return <div className='news-article-controls'>
        <Button onClick={() => this.setMode(MODES.EDIT)}>
          <Glyphicon glyph='pencil' />
        </Button>
        <Button onClick={() => this.setMode(MODES.DELETE)}>
          <Glyphicon glyph='remove' />
        </Button>
      </div>;
    }
    return '';
  }

  /**
   * Renders a confirmation box when deleting an article
   */
  renderConfirmDelete() {
    return <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Nieuwsbericht verwijderen</Modal.Title>
        </Modal.Header>

        <Modal.Body>Wil je dit bericht echt verwijderen?</Modal.Body>

        <Modal.Footer>
          <Button onClick={() => this.setMode(MODES.NORMAL)}>Annuleren</Button>
          <Button bsStyle="danger" onClick={this.deleteArticle.bind(this)}>Verwijderen</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  }

  /**
   * Renders an editor to edit an article
   */
  renderEditor() {
    var content = convertFromRaw(markdownToDraft(this.props.article.content));

    return <NewsEditor 
      content={content} 
      title={this.props.article.title}
      onSave={this.saveArticle.bind(this)}
      onCancel={() => this.setMode(MODES.NORMAL)}
      />;
  }

  /**
   * Renders an article
   */
  renderRegular() {
    return (
      <Panel className='news-article'>
        <h2>{this.props.article.title}</h2>
        <hr />
        <MarkdownRenderer markdown={this.props.article.content} />
        <hr />
        <p className='author-information'>{this.props.article.writer.name} - {printDateTime(new Date(this.props.article.created_at))}</p>
        {this.editBar()}
      </Panel>
    )
  }

  render() {
    switch (this.state.mode) {
      case MODES.EDIT:
        return <div>{this.renderEditor()}{this.renderRegular()}</div>;

      case MODES.DELETE:
        return <div>{this.renderConfirmDelete()}{this.renderRegular()}</div>;

      case MODES.NORMAL:
      default:
        return this.renderRegular();
    }
  }
}

const MODES = {
  NORMAL: 'NORMAL',
  EDIT: 'EDIT',
  DELETE: 'DELETE'
}

export default NewsArticle;