import Vector from './SvgVector.js';

export default class Geometry {
  constructor(translation = new Vector(), rotation = 0, scale = 1) {
    this.translation = translation;
    this.rotation = rotation;
    this.scale = scale;
  }

  static translate(x, y) {
    return new Geometry(new Vector(x, y));
  }

  static rotate(r) {
    return new Geometry(new Vector(), r);
  }

  static scale(s) {
    return new Geometry(new Vector(), 0, s);
  }

  static fromObj(obj) {
    const geom = new Geometry();
    geom.translation = obj.translation ? obj.translation : geom.translation;
    geom.rotation = obj.rotation ? obj.rotation : geom.rotation;
    geom.scale = obj.scale ? obj.scale : geom.scale;
    return geom;
  }
}
