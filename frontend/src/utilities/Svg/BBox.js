import Vector from './SvgVector';

export default class BBox {
  constructor(x, y, width, height) {
    // Top left position
    this.pos = new Vector(x, y);
    // Bounding box dimensions
    this.dims = new Vector(width, height);
  }

  get width() {
    return this.dims.x;
  }

  get height() {
    return this.dims.y;
  }

  merge(otherBox) {
    this.pos.x = Math.min(this.pos.x, otherBox.pos.x);
    this.pos.y = Math.min(this.pos.y, otherBox.pos.y);
    const right = Math.max(this.right, otherBox.right);
    const bottom = Math.max(this.bottom, otherBox.bottom);
    this.dims = (new Vector(right, bottom)).sub(this.pos);
  }

  addPoint(vec) {
    const hDist = this.horizontalDist(vec.x);
    if (hDist < 0) {
      this.pos.x += hDist;
      this.dims.x -= hDist;
    } else {
      this.dims.x += hDist;
    }
    const vDist = this.verticalDist(vec.y);
    if (vDist < 0) {
      this.pos.y += vDist;
      this.dims.y -= vDist;
    } else {
      this.dims.y += vDist;
    }
  }

  verticalDist(y) {
    if (y < this.top) return y - this.top; // Negative distance
    if (y > this.bottom) return y - this.bottom;
    return 0;
  }

  horizontalDist(x) {
    if (x < this.x) return x - this.x;
    if (x > this.right) return x - this.right;
    return 0;
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

  static fromDims(dims) {
    return new BBox(0, 0, dims.x, dims.y);
  }

  static fromObj(obj) {
    return new BBox(obj.x, obj.y, obj.width, obj.height);
  }

  static fromCenterDim(center, dim) {
    return new BBox(center.x - dim.x / 2, center.y - dim.y / 2, dim.x, dim.y);
  }
}