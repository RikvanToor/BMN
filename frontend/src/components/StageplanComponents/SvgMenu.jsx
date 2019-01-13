/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React, { PureComponent, Component } from 'react';
import Vector, { BBox } from '@Utils/Svg/SvgVector.js';
import SvgNode from '@Utils/Svg/SvgNode.js';

class Layoutable extends PureComponent {
  constructor(props) {
    super(props);
    this.internalComp = React.createRef();
  }

  componentDidUpdate() {
    this.internalComp.current.layout();
  }

  componentDidMount() {
    this.internalComp.current.layout();
  }

  render() {
    const { component, ...rest } = this.props;
    const Comp = component;
    return <Comp ref={this.internalComp} {...rest} />;
  }
}

class SvgMenuItem extends PureComponent {
  constructor(props) {
    super(props);
    this.onHover = this.onHover.bind(this);
    this.node = React.createRef();
    this.onLeave = this.onLeave.bind(this);
  }

  onHover() {
    this.props.context.cbs.onHover(this.props.id);
  }

  onLeave(e) {
    this.props.context.cbs.onOut(e);
  }

  layout() {
    const { id, context } = this.props;
    const node = this.node.current;
    const hoverElem = node.querySelector(`#${id}-hover`);
    const text = node.querySelector(`#${id}-item`);
    const svgNode = new SvgNode(hoverElem);
    const bbox = BBox.fromObj(text.getBBox());
    svgNode.height = bbox.height + 2 * context.padding;
    svgNode.width = context.elementWidth + 2 * context.padding;
  }

  render() {
    const {
      id, text, isHovered, padding, onClick, hoverColor, ref, ...props
    } = this.props;
    const rectProps = {
      fillOpacity: isHovered ? 1 : 0,
      onMouseLeave: this.onLeave,
      fill: hoverColor,
      pointerEvents: 'all',
      id: `${id}-hover`,
      onMouseEnter: this.onHover,
      onClick
    }
    return (
      <g id={id} ref={this.node}>
        <rect {...rectProps}/>
        <text pointerEvents='none' x={padding} y={padding} id={`${id}-item`} {...props}>{text}</text>
      </g>
    );
  }
}
SvgMenuItem.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  padding: PropTypes.number.isRequired,
  isHovered: PropTypes.bool,
};

class MenuContext {
  constructor() {
    this.dims = new Vector();
    this.padding = 0;
    this.elementWidth = 0;
    this.cbs = { onOut: () => {}, onHover: () => {} };
  }
}

class SvgMenuPane extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.menuContext = new MenuContext();
    this.menuContext.cbs = props.context.cbs;
    this.menuContext.padding = props.context.padding;
  }

  // eslint-disable-next-line react/sort-comp
  renderMenuItem(id, item, props, hoverItem, openItem) {
    const totalProps = Object.assign({}, props, item);
    const isHovered = hoverItem === id;
    if ('children' in item) {
      this.menuContext.cbs.registerSubmenu(id);
      delete totalProps.children;
      return (
        <React.Fragment key={id}>
          <Layoutable component={SvgMenuItem} id={id} isHovered={isHovered} {...totalProps} />
          {openItem.startsWith(id)
            ? (
              <Layoutable
                component={SvgMenuPane}
                id={`${id}-submenu`}
                openItem={openItem}
                hoverItem={hoverItem}
                pos={new Vector(0, 0)}
                items={item.children}
                {...totalProps}
              />
            )
            : null}
        </React.Fragment>
      );
    }
    return (<Layoutable key={id} component={SvgMenuItem} id={id} isHovered={isHovered} {...totalProps} />);
  }

  /**
   * Acquires layout data for the children of this menu pane, which includes the number of 
   * menu item children and the maximum width of the text of the children.
   * @param {array} childrenArray Array of child SVG elements
   */
  // eslint-disable-next-line react/sort-comp
  static determineChildLayoutData(childrenArray) {
    return childrenArray.reduce((accum, childNode) => {
      const child = new SvgNode(childNode);
      if (child.node.tagName.toLowerCase() === 'rect' || child.node.id.endsWith('submenu')) {
        return accum;
      }
      accum.maxChildWidth = Math.max(accum.maxChildWidth, child.find(`#${child.node.id}-item`).bbox.width);
      accum.childCount += 1;
      return accum;
    }, { childCount: 0, maxChildWidth: -1 });
  }

  // eslint-disable-next-line react/sort-comp
  layout() {
    const node = this.node.current;
    const { padding } = this.menuContext;

    const children = [...node.children];
    // Acquire aggregate child data
    const childData = SvgMenuPane.determineChildLayoutData(children);

    // Save the data
    this.menuContext.elementWidth = childData.maxChildWidth;

    // Layout elements
    const currPos = new Vector(0, 0);
    const bgElements = [];
    let lastY = 0;
    for (let i = 0; i < children.length; i++) {
      const child = new SvgNode(children[i]);
      if (child.node.tagName.toLowerCase() === 'rect') {
        bgElements.push(child);
      } else if (child.node.id.endsWith('submenu')) {
        // Submenu Element should always follow its menu item
        child.transform = Vector.yDir(lastY).add(Vector.xDir(this.menuContext.elementWidth + 2 * padding)).translateStr();
      } else {
        child.transform = currPos.translateStr();
        lastY = currPos.y;
        currPos.y += child.find(`#${child.node.id}-item`).bbox.height + 2 * padding;
      }
    }
    bgElements.forEach((child) => {
      child.width = this.menuContext.elementWidth + 2 * padding;
      child.height = currPos.y;
    });
  }

  render() {
    const {
      items, id, pos, hoverItem, openItem, context, ...props
    } = this.props;
    props.context = this.menuContext;
    props.padding = this.menuContext.padding;
    return (
      <g ref={this.node} transform={pos.translateStr()} id={id}>
        <rect id={`${id}-menu-bg`} x="0" stroke="black" fill="white"/>
        {items.map((el, ind) => this.renderMenuItem(`${id}-${ind}`, el, props, hoverItem, openItem))}
      </g>
    );
  }
}
SvgMenuPane.propTypes = {
  style: PropTypes.object, // Object for styling text
};

class SvgMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openedItem: '',
      hoveredItem: '',
    };
    this.node = React.createRef();
    this.handleHover = this.handleHover.bind(this);
    this.handleOut = this.handleOut.bind(this);

    // Registered submenus
    this.submenus = new Set();

    this.menuContext = new MenuContext();
    this.menuContext.padding = props.padding;
    this.menuContext.cbs.onOut = this.handleOut;
    this.menuContext.cbs.onHover = this.handleHover;
    this.menuContext.cbs.registerSubmenu = id => this.submenus.add(id);
  }

  handleHover(id) {
    const newState = { hoveredItem: id };
    if (!id.startsWith(this.state.openedItem)) {
      newState.openedItem = '';
    }
    if (this.submenus.has(id)) {
      newState.openedItem = id;
    }
    this.setState(newState);
  }

  handleOut(e) {
    // The element we move to is part of the menu and will trigger a hover
    if (e.relatedTarget.id && e.relatedTarget.id.startsWith(this.props.name)) {
      return;
    }
    this.setState({ hoveredItem: '', openedItem: '' });
  }

  render() {
    const {
      items, name, pos, padding,
    } = this.props;
    const { hoveredItem, openedItem } = this.state;
    const props = {
      style: { dominantBaseline: 'hanging' },
      hoverColor: '#337ab7',
      context: this.menuContext,
      items,
      id: name,
      padding,
      pos,
      hoverItem: hoveredItem,
      openItem: openedItem,
    };
    return (
      <Layoutable component={SvgMenuPane} {...props} />
    );
  }
}
SvgMenu.propTypes = {
  items: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
};

export default SvgMenu;
