import React, {Component} from 'react';

import {OverlayTrigger, Tooltip as BootstrapTooltip} from 'react-bootstrap';

/**
 * Thin wrapper over bootstrap Tooltip that adds the OverlayTrigger surrounding it.
 */
export default class Tooltip extends Component{
    render(){
        let {placement, id, tooltip} = this.props;
        return (
            <OverlayTrigger placement={placement} overlay={<BootstrapTooltip id={id}>{tooltip}</BootstrapTooltip>}>
            {this.props.children}
            </OverlayTrigger>
        );
    }
}