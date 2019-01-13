import Vector from '@Utils/Svg/SvgVector.js';
import { OrderAction, OrderActions } from '@Utils/Svg/Ordering.js';

export default class OrderManipulator {
  constructor(selectionHandler, cbs = { openMenu: (pos, items) => {}, closeMenu: () => {}, addOrderAction: (action) => {} }) {
    this.selectionHandler = selectionHandler;
    this.cbs = cbs;
    this.menuIsOpen = false;

    const triggerOrderAction = act => (e) => {
      // Prevent parent from handling closing.
      e.stopPropagation();
      console.log('Menu triggered');
      this.cbs.addOrderAction(new OrderAction(act, this.selectionHandler.selectionIds));
      this.cbs.closeMenu();
      this.menuIsOpen = false;
    };

    this.items = [
      {
        text: 'Plaats bovenaan',
        onClick: triggerOrderAction(OrderActions.PLACE_BACK),
      },
      {
        text: 'Plaats onderaan',
        onClick: triggerOrderAction(OrderActions.PLACE_FRONT),
      },
    ];
    this.multiSelectItems = [
      {
        text: 'Plaats eerst geselecteerd',
        children: [
          {
            text: 'boven selectie',
            onClick: triggerOrderAction(OrderActions.PLACE_AFTER),
          },
          {
            text: 'onder selectie',
            onClick: triggerOrderAction(OrderActions.PLACE_BEFORE),
          },
        ],
      },
    ];
  }

  createMenu() {
    const selectedMultiple = this.selectionHandler.multipleSelected();
    let items = this.items;
    if (selectedMultiple) {
      items = items.concat(this.multiSelectItems);
    }
    return items;
  }

  onClick(e) {
    if (this.menuIsOpen) {
      this.cbs.closeMenu();
      this.menuIsOpen = false;
    }
  }

  onContextMenu(e) {
    // Right mouse click
    if (e.button === 2 && this.selectionHandler.hasSelection()) {
      e.preventDefault();
      const { target } = e;
      const owner = target.ownerSVGElement ? target.ownerSVGElement : target;
      // Transform into local SVG coordinates.
      let pnt = owner.createSVGPoint();
      pnt.x = e.clientX;
      pnt.y = e.clientY;
      pnt = pnt.matrixTransform(owner.getScreenCTM().inverse());

      this.menuIsOpen = true;
      const menu = this.createMenu();
      this.cbs.openMenu(Vector.fromObj(pnt), menu);
    }
  }
}
