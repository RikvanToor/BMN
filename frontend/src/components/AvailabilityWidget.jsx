import React, { Component } from "react";
import AvailabilitySlider from './AvailabilitySlider.jsx';
import { Col, Button, ButtonGroup, Glyphicon, FormControl, FormGroup } from 'react-bootstrap';
import { isNullOrUndefined } from "util";
import { dispatch } from '@Services/AppDispatcher.js';
import { setAvailabilitiesAction } from '@Actions/RehearsalActions.js';

/**
 * The availabilities page. Since no state is needed, this is a Pure component that is rerendered
 */
class AvailabilityWidget extends Component {
    constructor(props) {
        super(props);
        this.minValue = new Date(props.rehearsal.start).getTime();
        this.maxValue = new Date(props.rehearsal.end).getTime();
        this.availabilities = props.rehearsal.availabilities;
        this.reason = {
            value: ''
        };
        this.synced = true;
        if (this.availabilities.length === 0) {
            this.availabilities = [this.createDefaultAvailability()]
            this.synced = false;
        }
        else if (this.availabilities.length === 1
            && isNullOrUndefined(this.availabilities[0].pivot.start)
            && isNullOrUndefined(this.availabilities[0].pivot.end)) {
            this.reason.value = this.availabilities[0].pivot.reason ? this.availabilities[0].pivot.reason : '';
            this.availabilities = [];
        }
        this.reasonOrAvailabilities = false;
    }

    componentDidMount() {
        this.updateButtonState();
    }

    /**
     * Makes sure there are availabilities or a reason present.
     */
    updateButtonState(forceUpdate) {
        var newCheck = this.availabilities.length > 0 || (this.reason && this.reason.value.length > 0);
        if (newCheck !== this.reasonOrAvailabilities) {
            this.reasonOrAvailabilities = newCheck;
            this.forceUpdate();
        }
        else if (forceUpdate) {
            this.forceUpdate();
        }
    }

    /**
     * Create an availability object containing default options:
     * Available the whole time and with a unique ID.
     */
    createDefaultAvailability() {
        var id = this.availabilities.length === 0 ? 1 :
            this.availabilities.map(x => x.id).reduce((a, b) => Math.max(a, b)) + 1;
        return {
            id: id,
            pivot: {
                rehearsal_id: this.props.rehearsal.id,
                start: this.props.rehearsal.start,
                end: this.props.rehearsal.end
            }
        };
    }

    /**
     * Generate an availability object and create an additional slider for it
     */
    addSlider() {
        this.availabilities.push(this.createDefaultAvailability());
        this.synced = false;
        this.updateButtonState(true);
    }

    deleteSlider(id) {
        this.availabilities = this.availabilities.filter(x => x.id !== id);
        this.synced = false;
        this.updateButtonState(true);
    }

    //TODO Move to general extensions or something
    printTime(d) {
        return d.toLocaleTimeString('nl-nl', { hour: '2-digit', minute: '2-digit' });
    }

    //TODO Move to general extensions or something
    toLocaleJSON(x) {
        var d = new Date(x);
        var date = d.toISOString().slice(0, 10);
        var time = d.toLocaleTimeString('nl-NL');
        return date + ' ' + time;
    }

    /**
     * Creates a slider for the availability object, or text input if the values are null
     * @param {An availability object} availability 
     */
    createInput(availability) {
        var startValue = new Date(availability.pivot.start).getTime();
        var endValue = new Date(availability.pivot.end).getTime();
        var className = this.synced ? 'slider-synced' : '';
        return <div key={availability.id}>
            <Col xs={10} className={className}>
                <AvailabilitySlider
                    min={this.minValue}
                    max={this.maxValue}
                    startValue={startValue}
                    endValue={endValue}
                    updateFunction={x => {
                        if(this.synced) {
                            this.synced = false;
                            this.forceUpdate();
                        }
                        availability.pivot.start = this.toLocaleJSON(new Date(x.min));
                        availability.pivot.end = this.toLocaleJSON(new Date(x.max));
                    }} />
            </Col>
            <Col xs={2}>
                <Glyphicon className="remove-slider text-danger" onClick={() => this.deleteSlider(availability.id)} glyph="remove" />
            </Col>
        </div>;
    }

    /**
     * Creates a text input for the reason of absence.
     */
    createReasonInput() {
        return <FormGroup>
            <FormControl 
                type="text" 
                placeholder="Reden" 
                inputRef={n => this.reason = n ? n : this.reason} 
                onChange={() => { this.synced = false; this.updateButtonState(); }} 
                defaultValue={this.reason.value} />
        </FormGroup>;
    }

    /**
     * Send a request to save the availabilities or reason
     */
    saveAvailabilities() {
        var data = {
            reason: this.reason.value,
            starts: this.availabilities.map(x => this.toLocaleJSON(x.pivot.start)),
            ends: this.availabilities.map(x => this.toLocaleJSON(x.pivot.end))
        };
        dispatch(setAvailabilitiesAction(this.props.rehearsal.id, data, () => { this.synced = true; this.forceUpdate(); } ));
    }

    render() {
        var start = new Date(this.props.rehearsal.start);
        var end = new Date(this.props.rehearsal.end);
        return (
            <div key={this.props.rehearsal.id}>
                <h3>{start.toLocaleDateString('nl-nl', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                <h4>{this.printTime(start)}-{this.printTime(end)} @ {this.props.rehearsal.location} {this.synced ? <Glyphicon className="text-success" glyph="ok" /> : ''}</h4>
                {this.availabilities.length === 0 ? this.createReasonInput() : this.availabilities.map(a => this.createInput(a))}
                <ButtonGroup>
                    <Button onClick={() => this.addSlider()}>Voeg slider toe</Button>
                    <Button disabled={!this.reasonOrAvailabilities} onClick={() => this.saveAvailabilities()}>Sla aanwezigheid op</Button>
                </ButtonGroup>
            </div>
        )
    }
}

export default AvailabilityWidget;