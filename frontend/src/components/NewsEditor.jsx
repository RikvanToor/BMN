import React, { Component } from "react";
import { Button, Modal, Alert } from 'react-bootstrap';
import RichEditor from '@Components/RichEditor.jsx';
import { printErrors } from '../GeneralExtensions.js';

class NewsArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Updates the current editState
   * @param {EditState} state 
   */
  setEditState(state) {
    this.state.editState = state;
  }

  callOnSave() {
    this.props.onSave(this.state.editState);
  }

  callOnCancel() {
    this.props.onCancel();
  }

  render() {
    return <div className="static-modal">
      <Modal.Dialog>
        {this.props.error ?
          <Alert bsStyle="danger">
            {printErrors(this.props.error.data)}
          </Alert> : null}
        <Modal.Header>
          <Modal.Title>Nieuwsbericht bewerken</Modal.Title>
        </Modal.Header>

        <Modal.Body><RichEditor content={this.props.content} title={this.props.title} onChange={(s) => this.setEditState(s)} /></Modal.Body>

        <Modal.Footer>
          <Button onClick={this.callOnCancel.bind(this)}>Annuleren</Button>
          <Button bsStyle="primary" onClick={this.callOnSave.bind(this)}>Opslaan</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>;
  }
}

export default NewsArticle;