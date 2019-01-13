import Vector, { BBox } from '@Utils/Svg/SvgVector.js';

import ManipulateModes from './ManipulateModes';

export default class GeometryManipulator {
  constructor(mode = ManipulateModes.TRANSLATE, selectionHandler, commitCb = (id, geometry) => {}) {
    // Manipulation mode
    this.mode = mode;
    this.commitCb = commitCb;
    // Last mouse position
    this.prevPos = new Vector();

    this.selectionHandler = selectionHandler;

    // Whether the selection is being manipulated
    this.manipulating = false;

    // Last scale of object to manipulate
    this.prevScale = 1;
    this.rotationCenter = new Vector();

    // Bound callbacks
    this.onMove = this.onMove.bind(this);
    this.onUp = this.onUp.bind(this);
    this.onDown = this.onDown.bind(this);
  }
  setMode(mode) {
    this.mode = mode;
    if (mode === ManipulateModes.SELECT) this.manipulating = false;
    else this.manipulating = true;
  }

  onMove(e) {
    const select = this.selectionHandler;
    if (select.singleSelected() && this.manipulating) {
      switch (this.mode) {
        case ManipulateModes.TRANSLATE:
          {
            const clientPos = Vector.fromMouseClient(e);
            const dr = clientPos.sub(this.prevPos);
            this.prevPos.setFromMouseEvent(e);
            // Translate the selected element
            select.selectionNodes[0].translate(dr);
          }
          break;
        case ManipulateModes.ROTATE:
          {
            const clientPos = Vector.fromMouseClient(e);

            const angle = this.prevPos.angleTo(clientPos, this.rotationPivot) / Math.PI * 180;
            this.prevPos.setFromMouseEvent(e);
            select.selectionNodes[0].rotate(angle, this.rotationCenter);
          }
          break;
        case ManipulateModes.SCALE:
          {
            const clientPos = Vector.fromMouseClient(e);
            const center = select.selectionNodes[0].getCenter();
            const oneScale = this.prevPos.sub(center).length();
            const newVal = clientPos.sub(center).length();
            select.selectionNodes[0].scale(newVal / oneScale * this.prevScale);
          }
          break;
        default:
          break;
      }
    }
  }

  onUp(e) {
    if (this.manipulating) {
      // Bit dangerous...
      this.commitCb(this.selectionHandler.selectionIds[0], this.selectionHandler.selectionNodes[0].state.geometry);
    }
    // this.selection = null;
    this.manipulating = false;
  }

  onDown(e) {
    if (this.selectionHandler.singleSelected() && this.mode !== ManipulateModes.SELECT) {
      this.manipulating = true;
      this.prevPos.setFromMouseEvent(e);
      if (this.mode === ManipulateModes.SCALE) {
        this.prevScale = this.selectionHandler.selectionNodes[0].state.geometry.get('scale');
      } else if (this.mode === ManipulateModes.ROTATE) {
        this.rotationCenter = this.selectionHandler.selectionNodes[0].getCenter();
        this.rotationPivot = BBox.fromObj(this.selectionHandler.selectionNodes[0].getClientRect()).center();
      }
    }
  }
}
