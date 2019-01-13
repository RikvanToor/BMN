import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Vector, { BBox } from '@Utils/Svg/SvgVector.js';
import PropTypes from 'prop-types';
import { format } from '@Utils/StringUtils.js';
import SvgNode from '@Utils/Svg/SvgNode.js';
import { wrap } from '@Utils/NumberUtils.js';
import Geometry from '@Models/Stageplan/Geometry.js';
import SvgText from './SvgText.jsx';
import { withSvgContext } from './SvgContext.js';

class StageplanElement extends Component {
  /**
   * Renders a red selection rectangle
   * @param {number} width Width of the internal element
   * @param {number} height Height of the internal element
   */
  static selection(width, height) {
    return (
      <rect x="-5" y="-5" strokeWidth={3} strokeLinejoin="round" width={width + 10} height={height + 10} stroke="red" fill="none" />
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      geometry: props.geometry,
      center: new Vector(),
      rotationCenter: new Vector(),
      dimensions: new Vector(1, 1),
      showName: true,
      showId: false,
    };
    this.node = React.createRef();
    this.startDrag = this.startDrag.bind(this);
  }

  // eslint-disable-next-line react/sort-comp
  getClientRect() {
    return this.node.current.getBoundingClientRect();
  }

  getCenter() {
    return BBox.fromObj(this.node.current.getBBox()).center();
  }

  getLocalCenter() {
    const node = this.node.current.querySelector(`#el${this.props.id}_glassPane`);
    return BBox.fromObj(node.getBBox()).center();
  }

  /**
     * Translates the object by the given vector
     * @param {Vector} dr The displacement
     */
  translate(dr) {
    this.setState({ geometry: this.state.geometry.translate(dr) }, () => this.triggerGeometryChange());
  }

  /**
     * Changes
     * @param {number} dr Change in angle
     * @param {Vector} center Rotation center
     */
  rotate(dr, center) {
    this.setState({ geometry: this.state.geometry.rotate(dr), rotationCenter: center }, () => this.triggerGeometryChange());
  }

  scale(s) {
    this.setState({ geometry: this.state.geometry.setScale(s) }, () => this.triggerGeometryChange());
  }

  triggerGeometryChange() {
    if (this.props.onGeometryChange) {
      this.props.onGeometryChange(this.props.id, this.state.geometry);
    }
  }

  getTransformString() {
    const { geometry, dimensions } = this.state;
    const box = BBox.fromDims(dimensions.scale(geometry.get('scale')));
    const center = box.center();
    return `${geometry.get('translation').translateStr()} ${
      center.translateStr()} ${
      Vector.origin().rotateAboutStr(geometry.get('rotation'))} ${
      center.neg().translateStr()}`;
  }

  getDimensions() {
    return this.state.dimensions;
  }

  getScaledDimensions() {
    return this.state.dimensions.scale(this.state.scale);
  }

  startDrag(e) {
    const { onElementClick, id, selected } = this.props;
    onElementClick(e, id, this);
  }

  updateLayout(dims, pos) {
    const pane = new SvgNode(this.node.current.querySelector(`#el${this.props.id}_glassPane`));
    pane.dims = dims;
    pane.pos = pos;
    this.setState({ center: this.getLocalCenter(), dimensions: dims });
  }

  componentDidMount() {
    // Update the glasspane to reflect the size of the child SVG element.
    const node = this.node.current;
    if (!node) {
      console.warn('Could not find node');
      return;
    }
    const childNode = new SvgNode(node.querySelector(`#el${this.props.id}_container`));
    if (childNode.isEmpty()) {
      console.warn('Could not find child');
      return;
    }
    const bbox = childNode.bbox;
    if (bbox.dims.x !== this.state.dimensions.x || bbox.dims.y !== this.state.dimensions.y) {
      this.updateLayout(bbox.dims, bbox.pos);
    }
  }

  renderName() {
    const props = { flip: this.state.geometry.rotation > 90 && this.state.geometry.rotation < 270 };
    props.vOffset = props.flip ? 5 : -5;
    const { dimensions } = this.state;
    if (!this.props.name) {
      return null;
    }
    return (
      <SvgText
        style={{ dominantBaseline: 'hanging' }}
        center="h"
        referenceRect={{
          width: this.state.geometry.scale * dimensions.x, height: this.state.geometry.scale * dimensions.y, x: 0, y: 0,
        }}
        parentId={`el${this.props.id}_scaling`}
        {...props}
      >
        {this.props.name}
      </SvgText>
    );
  }

  render() {
    const {
      id, geometry, context, onGeometryChange, selected, name, children, onElementClick, ...props
    } = this.props;
    const child = React.Children.only(children);
    const dims = this.state.dimensions;

    props.id = `el${id}`;

    // Place name/id text outside scaling group to keep fontsize the same.
    return (
      <g transform={this.getTransformString()} ref={this.node}>
        <g id={`${props.id}_scaling`} transform={`${format('scale({0})', this.state.geometry.get('scale'))}`}>
          <g id={`${props.id}_container`}>
            {React.cloneElement(child, props)}
          </g>
          <rect x="0" y="0" id={`${props.id}_glassPane`} width={dims.x} height={dims.y} onClick={this.startDrag} visibility="hidden" pointerEvents="all" />
          {selected
            ? (StageplanElement.selection(dims.x, dims.y))
            : null}
        </g>
        {this.state.showName ? this.renderName() : null}
      </g>
    );
  }
}
StageplanElement.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  // Triggered when geometry is changed, i.e. rotation, scale, translation.
  // Gets as arguments: (id, translation, rotation, scale)
  onGeometryChange: PropTypes.func,
  geometry: PropTypes.instanceOf(Geometry).isRequired,
  selected: PropTypes.bool,
  onElementClick: PropTypes.func.isRequired,
};

const StageplanElementExport = withSvgContext(StageplanElement);

export default StageplanElementExport;
