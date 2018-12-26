import React, {Component} from 'react';
import {FormControl, ControlLabel, FormGroup} from 'react-bootstrap';
import PropTypes from 'prop-types';

export default class FormElement extends Component{
    render(){
      let {label, type} = this.props;
      return (
        <FormGroup>
          <ControlLabel>{label}</ControlLabel>
          <FormControl type={type} />
        </FormGroup>
      );
    }
};
FormElement.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export class SelectFormField extends Component{
  render(){
    let {onChange,label,options, ...rest} = this.props;
    return (
      <FormGroup>
        <ControlLabel>{label}</ControlLabel>
        <FormControl componentClass="select" onChange={onChange}  {...rest}>
        {options.map((el)=><option key={el.value} value={el.value}>{el.name}</option>)}
        </FormControl>
      </FormGroup>
    );
  }
}