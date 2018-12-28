import { format } from '@Utils/StringUtils.js';

function clamp(val, min, max) {
  return Math.max(Math.min(val, max), min);
}

export default class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  cross(other) {
    return this.x * other.y - this.y * other.x;
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  yOnly() {
    return new Vector(0, this.y);
  }

  xOnly() {
    return new Vector(this.x, 0);
  }

  sub(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  translateStr() {
    return format('translate({0},{1})', this.x, this.y);
  }

  scaleAboutStr(scale) {
    return this.translateStr() + format('scale({0}', scale) + this.neg().translateStr();
  }

  rotateAboutStr(rotate) {
    return format('rotate({0},{1},{2})', rotate, this.x, this.y);
  }

  static origin() {
    return new Vector(0, 0);
  }

  static fromMouseClient(e) {
    return new Vector(e.clientX, e.clientY);
  }

  setFromMouseEvent(e) {
    this.x = e.clientX;
    this.y = e.clientY;
  }

  /**
     * Returns the angle from this vector to the other vector,
     * relative to the specified center.
     * @param {Vector} other
     * @param Vector} center
     * @return angle from this vector to the other vector in RADIANS
     */
  angleTo(other, center) {
    const v1 = this.sub(center);
    const v2 = other.sub(center);
    // Check crossproduct sign for direction
    const cp = v1.cross(v2);
    const val = Math.acos(clamp(v1.dot(v2) / v1.length() / v2.length(), -1, 1));
    return cp > 0 ? val : -val;
  }

  set(other) {
    this.x = other.x;
    this.y = other.y;
  }

  /**
   * Returns the negation of this vector.
   * @returns Negated version of this vector
   */
  neg() {
    return new Vector(-this.x, -this.y);
  }

  subSelf(other) {
    this.x -= other.x;
    this.y -= other.y;
  }

  scale(factor) {
    return new Vector(this.x * factor, this.y * factor);
  }

  scaleSelf(factor) {
    this.x *= factor;
    this.y *= factor;
  }

  add(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  addSelf(other) {
    this.x += other.x;
    this.y += other.y;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

export class BBox {
  constructor(x, y, width, height) {
    // Top left position
    this.pos = new Vector(x, y);
    // Bounding box dimensions
    this.dims = new Vector(width, height);
  }

  get left() {
    return this.pos.x;
  }

  get right() {
    return this.pos.x + this.dims.x;
  }

  get top() {
    return this.pos.y;
  }

  get bottom() {
    return this.pos.y + this.dims.y;
  }

  center() {
    return this.pos.add(this.dims.scale(0.5));
  }

  static fromObj(obj) {
    return new BBox(obj.x, obj.y, obj.width, obj.height);
  }

  static fromCenterDim(center, dim) {
    return new BBox(center.x - dim.x / 2, center.y - dim.y / 2, dim.x, dim.y);
  }
}
