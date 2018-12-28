import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Vector from './SvgVector.js';
import StageplanElement from './StageplanElement.jsx';
import SvgText from './SvgText.jsx';
import Geometry from './Geometry.js';

// Icons
import CrosshairIcon from './Assets/Icons/crosshair.svg';

// Visuals
import Keys from './Assets/keys.svg';
import Monitor from './Assets/monitor.svg';
import Actor from './Assets/actor.svg';
import Amp from './Assets/amp.svg';
import Elevation from './Assets/elevation.svg';

export const componentMap = {
  actor: Actor,
  keys: Keys,
  monitor: Monitor,
  amp: Amp,
  elevation: Elevation,
};

// White text coloring
const invText = { color: 'white' };

class StageplanCanvas extends Component {
  renderInstrument(name, id, type, geometry) {
    const props = { name, id, geometry };
    if (this.props.onGeometryChange) {
      props.onGeometryChange = this.props.onGeometryChange;
    }
    // Render unknown type
    if (!(type in componentMap)) {
      return (<StageplanElement key={id} {...props}><rect width="80" height="30" /></StageplanElement>);
    }
    const Comp = componentMap[type];
    return (<StageplanElement key={id} {...props}><Comp /></StageplanElement>);
  }

  render() {
    let { crosshairLoc, members, instruments, onGeometryChange, ...props } = this.props;
    crosshairLoc = crosshairLoc || new Vector(-100, -100);
    return (
      <svg xmlns="http://www.w3.org/2000/svg" {...props}>
        {
                    instruments.map(el => this.renderInstrument(el.name, el.id, el.type, el.geometry))
                }
        <StageplanElement geometry={Geometry.translate(100, 200)} id="keys1" name="Keys 1"><Keys /></StageplanElement>
        <StageplanElement geometry={Geometry.translate(200, 200)} id="monitor1" name="Monitor (1)"><Monitor /></StageplanElement>
        {this.props.members.map(member => (<StageplanElement key={member.name} geometry={member.geometry} name={member.name} id={member.id}><Actor /></StageplanElement>))}
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
      </svg>
    );
  }
}
StageplanCanvas.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default StageplanCanvas;
