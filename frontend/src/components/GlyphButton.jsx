import React, { PureComponent } from "react";
import PropTypes from 'prop-types'; 
import {Button, Glyphicon} from 'react-bootstrap';
import {isUndefined} from '@Utils/TypeChecks.js';

export default class GlyphButton extends PureComponent {
    render(){
      let {rightMargin,color,glyph, ...rest} = this.props;
      const style = {marginRight:rightMargin ? rightMargin : '0px', color : color};
      return (
        <Button {...rest}><Glyphicon glyph={glyph} style={style}/>{this.props.children}</Button>
      );
    }
}