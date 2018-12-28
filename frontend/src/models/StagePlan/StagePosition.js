import Geometry from '@Utils/Svg/Geometry.js';

export default class StagePosition {
  constructor(name, geometry = new Geometry(), id = '') {
    this.name = name;
    if (!id) {
      this.id = name.replace(/([^a-zA-Z0-9_]|\s)+/g, '-');
    }
    else {
      this.id = id;
    }
    this.geometry = geometry;
  }
}
