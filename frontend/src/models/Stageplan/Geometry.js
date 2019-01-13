import { format } from '@Utils/StringUtils.js';
import Vector from '@Utils/Svg/SvgVector.js';

import { Record } from 'immutable';
import { wrap } from '@Utils/NumberUtils.js';

export default class Geometry extends Record({ translation: new Vector(), rotation: 0, scale: 1 }) {
  stringify() {
    return format('t:{0},{1}|r:{2}|s:{3}', this.translation.x, this.translation.y, this.rotation, this.scale);
  }

  translate(vector) {
    return this.set('translation', this.translation.add(vector));
  }

  rotate(dr) {
    return this.set('rotation', wrap(this.rotation + dr, 360));
  }

  setScale(s) {
    return this.set('scale', s);
  }

  static translation(x, y) {
    return new Geometry({ translation: new Vector(x, y) });
  }

  static rotation(r) {
    return new Geometry({ rotation: r });
  }

  static scaling(s) {
    return new Geometry({ scale: s });
  }

  static fromStr(str) {
    const parts = str.split('|');
    const translation = parts[0].substr(2).split(',').map(el => parseFloat(el));
    const rotation = parseFloat(parts[1].substr(2));
    const scale = parseFloat(parts[2].substr(2));
    return new Geometry({translation: new Vector(translation[0], translation[1]), rotation, scale});
  }

  static fromObj(obj) {
    const geom = {};
    geom.translation = obj.translation ? obj.translation : geom.translation;
    geom.rotation = obj.rotation ? obj.rotation : geom.rotation;
    geom.scale = obj.scale ? obj.scale : geom.scale;
    return new Geometry(geom);
  }
}
