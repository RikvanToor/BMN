/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import {
  Form as BootstrapForm, Button, FormGroup, ControlLabel, FormControl,
} from 'react-bootstrap';

const BmnFormContext = React.createContext();

function notEmpty(fd, value) {
  return value.length > 0;
}
function fieldEqual(fd, value, otherField) {
  return fd.formFields[otherField].value === value;
}
function minLength(fd, value, minLen) {
  return value.length >= minLen;
}


class FormValidator {
  constructor() {
    this.validators = [];
  }

  static create() {
    return new FormValidator();
  }
}

class ReactFormData {
  constructor(submitCb) {
    this.submitCb = submitCb;
    this.formFields = {};
    this.setFieldValue = this.setFieldValue.bind(this);
  }

  value(name) {
    if (!this.formFields[name]) return null;
    return this.formField[name].value;
  }

  triggerSubmit() {
    this.submitCb(this.formFields);
  }

  registerField(name) {
    this.formFields[name] = {};
  }

  setFieldValue(name, value) {
    this.formFields[name].value = value;
  }
}

class Form extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.contextProvider = new ReactFormData(this.onSubmit);
  }

  onSubmit(formData) {
    if (this.props.onSubmit) {
      this.props.onSubmit(formData);
    }
  }

  render() {
    const { tag, children, ...props } = this.props;
    const WrapComp = tag || BootstrapForm;
    return (
      <WrapComp {...props}>
        <BmnFormContext.Provider value={this.contextProvider}>
          <BmnFormContext.Consumer>
            {context => React.Children.map(children, child => React.cloneElement(child, { formContext: context }) )}
          </BmnFormContext.Consumer>
        </BmnFormContext.Provider>
      </WrapComp>
    );
  }
}

export const FieldTypes = {
  TEXT: 'text',
  EMAIL: 'email', // Don't know what this does
  FILE: 'file',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  STATIC: 'static',
};

export class FormField extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.props.formContext.registerField(this.props.id);
  }

  onChange(e) {
    this.props.formContext.setFieldValue(this.props.id, e.target.value);
  }

  render() {
    let {
      label, controlId, validationState, formContext, onChange, type, options, ...props
    } = this.props;
    const fgProps = {};
    if (controlId) fgProps.controlId = controlId;
    if (validationState) fgProps.validationState = validationState;
    props.onChange = this.onChange;

    type = type || 'text';
    const wrap = el => (
      <FormGroup {...fgProps}>
        <ControlLabel>{label}</ControlLabel>
        {el}
      </FormGroup>
    );

    switch (type) {
      case FieldTypes.RADIO:
        // TODO: radio in itself is not interesting
        return wrap(this.props.children);
      case FieldTypes.CHECKBOX:
        return wrap((<Checkbox {...props} />));
      case FieldTypes.SELECT:
        return wrap((
          <FormControl componentClass="select" {...props}>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
          </FormControl>
        ));
      case FieldTypes.TEXTAREA:
        return wrap((
          <FormControl componentClass="textarea" {...props} />
        ));
      default:
        return wrap((<FormControl type={type} {...props} />));
    }
  }
}

export class SubmitButton extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
    console.log();
    this.props.formContext.triggerSubmit();
  }

  render() {
    const {
      onClick, formContext, tag, ...props
    } = this.props;
    const ButtonComp = tag || Button;
    return (
      <ButtonComp onClick={this.onClick} {...props}>{this.props.children}</ButtonComp>
    );
  }
}

export default Form;
