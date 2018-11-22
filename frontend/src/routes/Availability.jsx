import React, { Component } from "react";
import { deferredDispatch } from '@Services/AppDispatcher.js';
import { getScheduleAction, getScheduleForPlayerAction } from '@Actions/RehearsalActions.js'
import { Table, Tooltip, OverlayTrigger, Button, ButtonGroup } from 'react-bootstrap';
import { getAvailabilitiesAction } from '@Actions/RehearsalActions.js';
import AvailabilityWidget from '@Components/AvailabilityWidget.jsx';

/**
 * The availabilities page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
class AvailabilityPage extends Component {
    constructor(props) {
        super(props);
        this.getAvailabilities = this.getAvailabilities.bind(this);
    }

    componentDidMount() {
        if (this.props.isLoggedIn)
            this.getAvailabilities();
    }

    getAvailabilities() {
        deferredDispatch(getAvailabilitiesAction());
    }

    renderRehearsal(rehearsal) {
        return <AvailabilityWidget key={rehearsal.id} rehearsal={rehearsal} />;
    }

    render() {
        return (
            <div>
                {this.props.availabilities.map(x => this.renderRehearsal(x))}
            </div>
        )
    }
}

export default AvailabilityPage;