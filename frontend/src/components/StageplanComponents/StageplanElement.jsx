import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Vector, {BBox} from '@Components/StageplanComponents/SvgVector.js';
import PropTypes from 'prop-types';
import {withSvgContext} from '@Components/StageplanComponents/SvgContext.js';
import {format} from '@Utils/StringUtils.js';
import SvgNode from '@Components/StageplanComponents/SvgNode.js';
import SvgText from '@Components/StageplanComponents/SvgText.jsx';
import {wrap} from '@Utils/NumberUtils.js';
import Geometry from './Geometry.js';

class StageplanElement extends Component{
    constructor(props){
        super(props);

        let geometry = '';
        if(!props.geometry){
            geometry = new Geometry();
        }
        else {
            if(props.geometry instanceof Geometry) geometry = props.geometry;
            else geometry = Geometry.fromObj(props.geometry);
        }

        this.state = {
            translation: geometry.translation,
            center : new Vector(),
            rotation: geometry.rotation,
            rotationCenter: new Vector(),
            scale: geometry.scale,
            selected: false,
            showName: true,
            showId: false
        };
        this.dims = new Vector(1,1);

        this.startDrag = this.startDrag.bind(this);
    }
    domNode(){
        return ReactDOM.findDOMNode(this);
    }
    getClientRect(){
        return this.domNode().getBoundingClientRect();
    }
    getCenter(){
        return BBox.fromObj(this.domNode().getBBox()).center();
    }
    getLocalCenter(){
        let node = this.domNode().querySelector('#' + this.props.id + '_glassPane');
        return BBox.fromObj(node.getBBox()).center();
    }
    /**
     * Translates the object by the given vector
     * @param {Vector} dr The displacement
     */
    translate(dr){
        this.setState({translation: this.state.translation.add(dr)},()=>this.triggerGeometryChange())
    }
    /**
     * Changes 
     * @param {number} dr Change in angle
     * @param {Vector} center Rotation center
     */
    rotate(dr, center){
        let rotate = this.state.rotation + dr;
        //Wrap to [0, 360]
        rotate = wrap(rotate, 360);
        this.setState({rotation: rotate, rotationCenter: center},()=>this.triggerGeometryChange());
    }
    setSelected(val){
        this.setState({selected: val});
    }
    scale(s){
        this.setState({scale: s},()=>this.triggerGeometryChange());
    }
    triggerGeometryChange(){
        if(this.props.onGeometryChange){
            this.props.onGeometryChange(this.props.id, this.state.translation, this.state.rotation, this.state.scale);
        }
    }
    getTransformString(){
        let center = this.state.center;
        return this.state.translation.translateStr() + ' '
        + center.translateStr() + ' '
        + Vector.origin().rotateAboutStr(this.state.rotation) + ' '
        + format('scale({0})',this.state.scale) + ' '
        + center.neg().translateStr();
    }
    getDimensions(){
        return [this.width, this.height];
    }
    getScaledDimensions(){
        return [this.width * this.state.scale, this.height * this.state.scale];
    }
    startDrag(e){
        if(this.props.context.setDragableSelection(e,this)){
            this.setState({selected: true});
        }
    }
    componentDidMount(){
        //Update the glasspane to reflect the size of the child SVG element.
        let node = ReactDOM.findDOMNode(this);
        if(!node) {
            console.warn("Could not find node");
            return;
        }
        let childNode = new SvgNode(node.querySelector('#'+this.props.id+'_container'));
        if(childNode.isEmpty()){
            console.warn("Could not find child");
            return;
        }
        let bbox = childNode.bbox;
        this.dims = bbox.dims;
        let pane = new SvgNode(node.querySelector('#'+this.props.id + '_glassPane'));
        pane.dims = bbox.dims;
        pane.pos = bbox.pos;
        this.setState({center: this.getLocalCenter()});
    }
    static selection(width, height){
        return (
            <rect x="-5" y="-5" strokeWidth={3} strokeLinejoin="round" width={width + 10} height={height+10} stroke="red" fill="none"/>
        )
    }
    renderName(){
        let props = {flip: this.state.rotation > 90 && this.state.rotation < 270};
        props.vOffset = props.flip ? 5 : -5;
        return (
            <SvgText style={{dominantBaseline:'hanging'}} 
                center="h" 
                parentId={this.props.id+'_container'} {...props}>
                {this.props.name}
            </SvgText>
        );
    }
    render(){
        let {id, geometry, context, onGeometryChange, ...props} = this.props;
        let child = React.Children.only(this.props.children);

        props.id = id;
        //Save internally
        let el = React.cloneElement(child, props);
        return (
            <g transform={this.getTransformString()} >
                <g id={id + '_container'}>
                    {React.cloneElement(child, props)} 
                </g>
                <rect x="0" y="0" id={id+'_glassPane'} width={this.dims.x} height={this.dims.y} onMouseDown={this.startDrag} visibility="hidden" pointerEvents="all"/>
                {this.state.selected ? 
                    (StageplanElement.selection(this.dims.x, this.dims.y)):
                    null}
                {this.state.showName ? this.renderName() : null}
            </g>
        );
    }
}
StageplanElement.propTypes = {
    children: PropTypes.element,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    //Triggered when geometry is changed, i.e. rotation, scale, translation.
    //Gets as arguments: (id, translation, rotation, scale)
    onGeometryChange: PropTypes.func,
    geometry: PropTypes.object,
}

let StageplanElementExport = withSvgContext(StageplanElement);

export default StageplanElementExport;