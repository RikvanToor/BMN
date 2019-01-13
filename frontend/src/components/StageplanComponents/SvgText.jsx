import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withSvgContext } from './SvgContext.js';
import Vector, { BBox } from '@Utils/Svg/SvgVector.js';
import SvgNode from '@Utils/Svg/SvgNode.js';

class SvgText extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.ownRect = null;
    this.state = {
      ownRect: null
    };
  }

  // Only triggered on first mount, not on rerenders
  componentDidMount() {
    if (!this.props.referenceRect) {
      this.layout();
    }
  }

  componentDidUpdate() {
    if (!this.props.referenceRect) {
      this.layout();
    } else {
      const bbox = this.node.current.getBBox();
      if (!this.state.ownRect || this.state.ownRect.width != bbox.width || this.state.ownRect.height != bbox.height) {
        this.setState({ownRect: this.node.current.getBBox()});
      }
    }
  }

  layout() {
    const node = new SvgNode(this.node.current);
    // Get first SVG ancestor
    const svg = node.node.ownerSVGElement;
    if (!svg) return;
    const parent = new SvgNode(svg.querySelector(`#${this.props.parentId}`));
    if (node.isEmpty() || parent.isEmpty()) return;

    const layoutObj = this.calcLayout(node.bbox, parent.bbox);

    if (layoutObj.transform) {
      node.transform = layoutObj.transform;
    }
    node.pos = node.pos.add(layoutObj.offset);
  }
  
  calcLayout(nodeBbox, parentBbox) {
    let output = { offset: new Vector(), transform: '' };
    let { center, flip, hOffset, vOffset } = this.props;

    if (center) {
      const diff = parentBbox.center().sub(nodeBbox.center());
      if (center === 'both' || center === 'b') {
        output.offset = diff;
      } else if (center === 'vertical' || center === 'v') {
        output.offset = diff.yOnly();
      } else if (center === 'horizontal' || center === 'h') {
        output.offset = diff.xOnly();
      }
    }
    if (flip) {
      output.transform = nodeBbox.center().rotateAboutStr(180);
    } 
    // Apply offset
    if (hOffset) {
      const off = hOffset;
      if (off > 0) {
        output.offset.x = parentBbox.right + off - nodeBbox.pos.x;
      } else {
        output.offset.x = parentBbox.left + off - nodeBbox.dims.x - nodeBbox.pos.x;
      }
    }
    if (vOffset) {
      const off = vOffset;
      if (off > 0) {
        output.offset.y = parentBbox.bottom + off - nodeBbox.pos.y;
      } else {
        output.offset.y = parentBbox.top + off - nodeBbox.dims.y - nodeBbox.pos.y;
      }
    }
    return output;
  }

  render() {
    const {
      center, parentId, vOffset, hOffset, flip, referenceRect, ...props
    } = this.props;
    if (referenceRect && this.state.ownRect) {
      const layout = this.calcLayout(BBox.fromObj(this.state.ownRect), BBox.fromObj(referenceRect));
      props.transform = layout.offset.translateStr() + ' ' + layout.transform;
    }
    return (<text ref={this.node} {...props}>{this.props.children}</text>);
  }
}

SvgText.propTypes = {
  center: PropTypes.oneOf(['b', 'v', 'h', 'both', 'vertical', 'horizontal']),
  hOffset: PropTypes.number,
  vOffset: PropTypes.number,
  flip: PropTypes.bool,
};

export default withSvgContext(SvgText);
