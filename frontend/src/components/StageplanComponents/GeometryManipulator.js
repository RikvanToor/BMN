import Vector, { BBox } from '@Components/StageplanComponents/SvgVector.js';

export const ManipulateModes = {
  TRANSLATE: 0,
  ROTATE: 1,
  SCALE: 2,
  SELECT: 3,
};

export default class GeometryManipulator {
  constructor(mode = ManipulateModes.TRANSLATE) {
    // Manipulation mode
    this.mode = mode;
    // Last mouse position
    this.prevPos = new Vector();
    this.selection = null;
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

  setSelection(el, e) {
    if (this.mode !== ManipulateModes.SELECT) return false;

    if (this.selection) {
      this.selection.setSelected(false);
    }
    this.selection = el;
    this.prevPos.setFromMouseEvent(e);
    return true;
  }

  onMove(e) {
    if (this.selection && this.manipulating) {
      switch (this.mode) {
        case ManipulateModes.TRANSLATE:
          {
            const clientPos = Vector.fromMouseClient(e);
            const dr = clientPos.sub(this.prevPos);
            this.prevPos.setFromMouseEvent(e);
            // Translate the selected element
            this.selection.translate(dr);
          }
          break;
        case ManipulateModes.ROTATE:
          {
            const clientPos = Vector.fromMouseClient(e);

            const angle = this.prevPos.angleTo(clientPos, this.rotationPivot) / Math.PI * 180;
            this.prevPos.setFromMouseEvent(e);
            this.selection.rotate(angle, this.rotationCenter);
          }
          break;
        case ManipulateModes.SCALE:
          {
            const clientPos = Vector.fromMouseClient(e);
            const center = this.selection.getCenter();
            const oneScale = this.prevPos.sub(center).length();
            const newVal = clientPos.sub(center).length();
            this.selection.scale(newVal / oneScale * this.prevScale);
          }
          break;
        default:
          break;
      }
    }
  }

  onUp(e) {
    // this.selection = null;
    this.manipulating = false;
  }

  onDown(e) {
    if (this.selection && this.mode !== ManipulateModes.SELECT) {
      console.log('MANIPULATING');
      this.manipulating = true;
      this.prevPos.setFromMouseEvent(e);
      if (this.mode === ManipulateModes.SCALE) {
        this.prevScale = this.selection.state.scale;
      } else if (this.mode === ManipulateModes.ROTATE) {
        console.log(this.selection.getClientRect());
        this.rotationCenter = this.selection.getCenter();
        this.rotationPivot = BBox.fromObj(this.selection.getClientRect()).center();
        console.log(this.rotationPivot);
      }
    }
  }
}
