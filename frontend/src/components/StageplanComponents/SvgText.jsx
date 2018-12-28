import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {withSvgContext} from '@Components/StageplanComponents/SvgContext.js';
import SvgNode from '@Components/StageplanComponents/SvgNode.js';
import Vector from './SvgVector';

class SvgText extends Component {
    constructor(props){
        super(props);
        this.node = React.createRef();
    }
    //Is not triggered when first mounted
    componentDidUpdate(){
        this.layout();
    }
    //Only triggered on first mount, not on rerenders
    componentDidMount(){
        this.layout();
    }
    layout(){
        let node = new SvgNode(this.node.current);
        //Get first SVG ancestor
        let svg = node.node.ownerSVGElement;
        if(!svg) return;
        let parent = new SvgNode(svg.querySelector('#'+this.props.parentId));
        if(node.isEmpty() || parent.isEmpty()) return;
        
        //Bounding boxes
        let parentBbox = parent.bbox;
        let bbox = node.bbox;
        
        if(this.props.center){
            let diff = parentBbox.center().sub(bbox.center());
            if(this.props.center === 'both' || this.props.center === 'b'){
                node.pos = node.pos.add(diff);
            }
            else if(this.props.center === 'vertical' || this.props.center === 'v'){
                node.pos = node.pos.add(diff.yOnly());
            }
            else if(this.props.center === 'horizontal' || this.props.center === 'h'){
                node.pos = node.pos.add(diff.xOnly());
            }
        }
        if(this.props.flip){
            node.transform = bbox.center().rotateAboutStr(180);
        }
        else{
            node.transform = '';
        }
        //Apply offset
        if(this.props.hOffset){
            let off = this.props.hOffset;
            if(off > 0){
                node.x = parentBbox.right + off;
            }
            else{
                node.x = parentBbox.left + off - bbox.dims.x;
            }
        }
        if(this.props.vOffset){
            let off = this.props.vOffset;
            if(off > 0){
                node.y = parentBbox.bottom + off;
            }
            else{
                node.y = parentBbox.top + off - bbox.dims.y;
            }
        }
    }
    render(){
        let {center, parentId, vOffset, hOffset, flip, ...props} = this.props;
        return (<text ref={this.node} {...props}>{this.props.children}</text>);
    }
}

SvgText.propTypes = {
    center: PropTypes.oneOf(['b','v','h','both','vertical','horizontal']),
    hOffset: PropTypes.number,
    vOffset: PropTypes.number,
    flip: PropTypes.bool
}

export default SvgText;