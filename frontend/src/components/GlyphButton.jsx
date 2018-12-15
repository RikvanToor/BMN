import React, { PureComponent } from "react";
import PropTypes from 'prop-types'; 
import {Button, Glyphicon} from 'react-bootstrap';
import {isUndefined} from '@Utils/TypeChecks.js';

export default class GlyphButton extends PureComponent {
  constructor(props){
    super(props);
    this.click = this.click.bind(this);
  }
  click(e){
    if(this.props.onClick){
      this.props.onClick(e, this.props);
    }
  }
    render(){
      let {rightMargin,color,glyph,onClick, ...rest} = this.props;
      const style = {marginRight:rightMargin ? rightMargin : '0px', color : color};
      if(onClick){
        rest.onClick = this.click;
      }
      return (
        <Button {...rest}><Glyphicon glyph={glyph} style={style}/>{this.props.children}</Button>
      );
    }
}