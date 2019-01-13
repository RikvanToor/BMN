import Geometry from './Geometry.js';

export default class StagePosition {
  constructor(name, geometry = new Geometry(), id = '') {
    this.name = name;
    this.changed = false;
    this.new = false;
    if (!id) {
      this.id = name.replace(/([^a-zA-Z0-9_]|\s)+/g, '-');
    }
    else {
      this.id = id;
    }
    this.geometry = geometry;
  }
}
