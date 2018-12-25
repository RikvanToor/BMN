import React, {PureComponent} from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * A component that displays color ranges as blocks of a specified height in parent container.
 * 
 */
export default class ColorRanges extends PureComponent{
    render(){
      const valSpan = this.props.end - this.props.start;
      const defaultStyle = {
        position: 'absolute',
        display: 'inline-block',
        height:'5px',
        top:0
      };
      
      return(
        <div style={{position:'relative'}}>
          {
            this.props.ranges.map((range)=>{
              const left = 100*(range.start - this.props.start)/valSpan;
              const width = 100*(range.end-range.start)/valSpan;
              //Percentual offset and width
              let styling = { left: left+'%', width:width+'%', ...defaultStyle};
              //Color the range
              if('color' in range) styling.backgroundColor = range.color;
              const clsName = 'cls' in range ? range.cls : '';
              const el = (<span key={range.start} className={clsName} style={styling}/>);
              //Possibly add a tooltip
              if('toolTip' in range){
                return(<OverlayTrigger key={range.start} placement="bottom" overlay={<Tooltip id={range.start}>{range.toolTip}</Tooltip>}>{el}</OverlayTrigger>);
              }
              else{
                return el;
              }
            })
          }
        </div>
      );
    }
  }
  ColorRanges.propTypes = {
      //Value ranges: objects with the following keys:
      // 'start': start value
      // 'end': end value
        // [optional] 'color': the css color for the range
      // [optional] 'tooltip': tooltip for the element
    ranges: PropTypes.array,
    //Minimum value
    start: PropTypes.number,
    //Maximum value
    end: PropTypes.number
  };