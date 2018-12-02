import React, { Component } from "react";
import { Panel, Glyphicon, Button, Modal } from 'react-bootstrap';
import MarkdownRenderer from 'react-markdown-renderer';
import { printDateTime } from '../GeneralExtensions.js';
import RichEditor from '@Components/RichEditor.jsx';

/**
 * Display for a news article
 */
class NewsArticle extends Component {
  constructor(props) {
    super(props);
    this.state = { article: this.props.article };
    this.state.mode = this.props.article ? MODES.NORMAL : MODES.EDIT;
  }

  setMode(mode) {
    this.state.mode = mode;
    this.forceUpdate();
  }

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

  renderConfirmDelete() {
    return <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Nieuwsbericht verwijderen</Modal.Title>
        </Modal.Header>

        <Modal.Body>Wil je dit bericht echt verwijderen?</Modal.Body>

        <Modal.Footer>
          <Button onClick={() => this.setMode(MODES.NORMAL)}>Annuleren</Button>
          <Button bsStyle="danger">Verwijder</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  }

  renderEditor() {
    return <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Nieuwsbericht bewerken</Modal.Title>
        </Modal.Header>

        <Modal.Body><RichEditor /></Modal.Body>

        <Modal.Footer>
          <Button onClick={() => this.setMode(MODES.NORMAL)}>Annuleren</Button>
          <Button bsStyle="primary">Opslaan</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>;
  }

  renderRegular() {
    return (
      <Panel className='news-article'>
        <h2>{this.state.article.title}</h2>
        <hr />
        <MarkdownRenderer markdown={this.state.article.content} />
        <hr />
        <p className='author-information'>{this.state.article.writer.name} - {printDateTime(new Date(this.state.article.created_at))}</p>
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