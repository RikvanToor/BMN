import Vector, { BBox } from './SvgVector.js';

export default class SvgNode {
  constructor(domNode) {
    this.node = domNode;
  }

  isEmpty() {
    return !this.node;
  }

  setAttr(name, val) {
    this.node.setAttribute(name, val);
  }

  floatAttr(name) {
    const val = parseFloat(this.node.getAttribute(name));
    if (val) return val;
    return 0;
  }

  set transform(val) {
    this.setAttr('transform', val);
  }

  set pos(val) {
    this.x = val.x;
    this.y = val.y;
  }

  get pos() {
    return new Vector(this.x, this.y);
  }

  set dims(val) {
    this.width = val.x;
    this.height = val.y;
  }

  get bbox() {
    return BBox.fromObj(this.node.getBBox());
  }

  get x() {
    return this.floatAttr('x');
  }

  set x(val) {
    this.setAttr('x', val);
  }

  get y() {
    return this.floatAttr('y');
  }

  set y(val) {
    this.setAttr('y', val);
  }

  get width() {
    return this.floatAttr('width');
  }

  set width(val) {
    this.setAttr('width', val);
  }

  get height() {
    return this.floatAttr('height');
  }

  set height(val) {
    this.setAttr('height', val);
  }
}
