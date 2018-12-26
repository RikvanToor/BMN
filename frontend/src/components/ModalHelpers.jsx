import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';


export function yesNoModal(title, body, onYes, onNo, yesLabel="Ja", noLabel="Nee"){
  return (
    <Modal show={true}>
        <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {body}
        </Modal.Body>

        <Modal.Footer>
            <Button bsStyle="primary" onClick={onYes}>{yesLabel}</Button>
            <Button onClick={onNo}>{noLabel}</Button>
        </Modal.Footer>
    </Modal>
);
}

export function yesNoModalFromObj(obj){
  if('yesLabel' in obj && 'noLabel' in obj){
    return yesNoModal(obj.title, obj.body, obj.onYes, obj.onNo, obj.yesLabe, obj.noLabel );
  }
  return yesNoModal(obj.title, obj.body, obj.onYes, obj.onNo);
}