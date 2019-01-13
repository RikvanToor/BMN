import ManipulateModes from './ManipulateModes';

export default class SelectionHandler {
  constructor(mode) {
    this.selected = {};
    this.selectionIds = [];
    this.selectionNodes = [];

    this.mode = mode;
  }

  setSelection(el, id, e) {
    if (this.mode !== ManipulateModes.SELECT) return false;

    if (e.shiftKey) {
      this.selectionIds.push(id);
      this.selectionNodes.push(el);
      this.selected[id] = this.selectionNodes.length;
    } else {
      // Ignore reselect
      if (this.singleSelected() && id === this.selectionIds[0]) return false;

      this.selectionIds = [id];
      this.selectionNodes = [el];
      this.selected = {};
      this.selected[id] = 0;
    }
    return true;
  }

  hasSelection() {
    return this.selectionIds.length > 0;
  }

  singleSelected() {
    return this.selectionIds.length === 1;
  }

  multipleSelected() {
    return this.selectionIds.length > 1;
  }
}
