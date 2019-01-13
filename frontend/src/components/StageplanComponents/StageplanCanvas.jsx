import React, { Component, Purecomponent } from 'react';
import PropTypes from 'prop-types';
import Vector from '@Utils/Svg/SvgVector.js';
import Geometry from '@Models/Stageplan/Geometry.js';
import { Map } from 'immutable';
import StageplanElement from './StageplanElement.jsx';
import SvgText from './SvgText.jsx';


import { componentMap } from './ImportableElements.js';

// Icons
import CrosshairIcon from './Assets/Icons/crosshair.svg';

// White text coloring
const invText = { color: 'white' };

/**
 * Canvas to draw stageplan on.
 */
class StageplanCanvas extends Component {
  renderInstrument(name, id, type, geometry) {
    const props = { name, id, geometry };
    if (this.props.onGeometryChange) {
      props.onGeometryChange = this.props.onGeometryChange;
    }
    // Override location with modified location
    if (this.props.locations.has(id)) {
      props.geometry = this.props.locations.get(id);
    }
    // Is the element selected?
    props.selected = id in this.props.selected;
    props.onElementClick = this.props.onElementClick;

    // Render unknown type
    if (!(type in componentMap)) {
      return (<StageplanElement key={id} {...props}><rect width="80" height="30" /></StageplanElement>);
    }
    // Render known type
    const Comp = componentMap[type];
    return (<StageplanElement key={id} {...props}><Comp /></StageplanElement>);
  }

  render() {
    let {
      crosshairLoc, positions, elements, selectionId, roles, onGeometryChange, onElementClick, children, svgRef, drawOrder, ...props
    } = this.props;
    crosshairLoc = crosshairLoc || new Vector(-100, -100);
    if (svgRef) {
      props.ref = svgRef;
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" {...props}>
        {
         drawOrder.map((ind) => {
           const el = elements.get(ind);
           return this.renderInstrument(el.name, el.id, el.type, el.geometry);
         })
        }
        {
          positions.map(member => (
            <StageplanElement key={member.name} geometry={member.geometry} name={member.name} id={member.id} onElementClick={onElementClick}>
              <Actor />
            </StageplanElement>
          ))
        }
        <g>
          <rect x="0" y="430" width={this.props.width} height="50" id="frontRect" />
          <SvgText fill="white" x="200" y="10" center="both" parentId="frontRect" style={invText}>AUDIENCE</SvgText>
        </g>
        <g>
          <rect x="0" y="0" width={this.props.width} height="50" id="backRect" />
          <SvgText fill="white" x="200" center="both" y="295" parentId="backRect" style={invText}>BACK OF STAGE</SvgText>
        </g>
        <g transform={crosshairLoc.translateStr()}>
          <CrosshairIcon />
        </g>
        {children}
      </svg>
    );
  }
}
StageplanCanvas.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  locations: PropTypes.instanceOf(Map).isRequired,
  elements: PropTypes.instanceOf(Map).isRequired,
  selected: PropTypes.object,
};

export default StageplanCanvas;
