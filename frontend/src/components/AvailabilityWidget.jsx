import React, { Component } from "react";
import AvailabilitySlider from './AvailabilitySlider.jsx';
import { Col, Button, ButtonGroup, Glyphicon, FormControl, FormGroup } from 'react-bootstrap';
import { isNullOrUndefined } from "util";

/**
 * The availabilities page. Since no state is needed, this is a Pure component that is rerendered
 */
class AvailabilityWidget extends Component {
    constructor(props) {
        super(props);
        this.minValue = new Date(props.rehearsal.start).getTime();
        this.maxValue = new Date(props.rehearsal.end).getTime();
        this.availabilities = props.rehearsal.availabilities;
        this.reason = '';
        if (this.availabilities.length === 0) {
            this.availabilities = [this.createDefaultAvailability()]
        }
        else if (this.availabilities.length === 1
            && isNullOrUndefined(this.availabilities[0].pivot.start)
            && isNullOrUndefined(this.availabilities[0].pivot.end)) {
            this.reason = this.availabilities[0].reason ? this.availabilities[0].reason :  '';
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
        this.forceUpdate();
    }

    deleteSlider(id) {
        this.availabilities = this.availabilities.filter(x => x.id !== id);
        this.forceUpdate();
    }

    //TODO Move to general extensions or something
    printTime(d) {
        return d.toLocaleTimeString('nl-nl', { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Creates a slider for the availability object, or text input if the values are null
     * @param {An availability object} availability 
     */
    createInput(availability) {
        var startValue = new Date(availability.pivot.start).getTime();
        var endValue = new Date(availability.pivot.end).getTime();
        return <div key={availability.id}>
            <Col xs={10}>
                <AvailabilitySlider
                    min={this.minValue}
                    max={this.maxValue}
                    startValue={startValue}
                    endValue={endValue}
                    updateFunction={x => {
                        availability.pivot.start = new Date(x.min).toLocaleString('nl-NL');
                        availability.pivot.end = new Date(x.max).toLocaleDateString('nl-NL');
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
            <FormControl type="text" placeholder="Reden" inputRef={n => this.reason = n} defaultValue={this.reason}/>
        </FormGroup>;
    }

    saveAvailabilities() {
        console.log(this.reason.value);
        console.log(this.availabilities);
    }

    render() {
        var start = new Date(this.props.rehearsal.start);
        var end = new Date(this.props.rehearsal.end);
        return (
            <div key={this.props.rehearsal.id}>
                <h3>{start.toLocaleDateString('nl-nl', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                <h4>{this.printTime(start)}-{this.printTime(end)} @ {this.props.rehearsal.location}</h4>
                {this.availabilities.length === 0 ? this.createReasonInput() : this.availabilities.map(a => this.createInput(a))}
                <ButtonGroup>
                    <Button onClick={() => this.addSlider()}>Voeg slider toe</Button>
                    <Button onClick={() => this.saveAvailabilities()}>Sla aanwezigheid op</Button>
                </ButtonGroup>
            </div>
        )
    }
}

export default AvailabilityWidget;