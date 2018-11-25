import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import {isUndefined} from '@Utils/TypeChecks.js';

class ConditionalComponent extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
      if(this.props.condition){
          return this.props.children;
      }
      if(!isUndefined(this.props.otherwise)){
        return this.props.otherwise;
      }
      return null;
  }
}
ConditionalComponent.propTypes = {
    condition: PropTypes.bool.isRequired,
    children: PropTypes.element,
    otherwise: PropTypes.element
};


export default ConditionalComponent;
