import React, { PureComponent } from "react";
import PropTypes from 'prop-types';

class ConditionalComponent extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
      if(this.props.condition){
          return this.props.children;
      }
      return null;
  }
}
ConditionalComponent.propTypes = {
    condition: PropTypes.bool.isRequired,
    children: PropTypes.element
}


export default ConditionalComponent;
