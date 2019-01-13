import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';
import { Modal } from 'react-bootstrap';
import Form, { FormField } from '@Components/Form.jsx';

class AddRoleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIds: new Set(),
    };
  }

  onSave(){

  }

  render() {
      const { elements } = this.props;
    return (
      <Modal show={true}>
        <Modal.Header>Maak een rol aan</Modal.Header>
        <Modal.Body>
            <Form>
                <FormField label="Naam" type="text" id="name"/>
                <FormField label="Naam" type="text" id="name"/>
            </Form>
        </Modal.Body>
        </Modal>
    );
  }
}

export default AddRoleComponent;
