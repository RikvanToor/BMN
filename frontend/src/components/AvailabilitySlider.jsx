import React, { Component } from "react";
import { Col } from 'react-bootstrap';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

/**
 * A simple slider, customized to select a time range.
 */
class AvailabilityWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: { min: props.startValue, max: props.endValue },
        };
    }

    //TODO Move to general extensions or something
    printTime(d) {
        return d.toLocaleTimeString('nl-nl', { hour: '2-digit', minute: '2-digit' });
    }

    setValue(value) {
        this.props.updateFunction(value);
        this.setState({ value });
    }

    makeLabel(time) {
        var d = new Date(time);
        return this.printTime(d);
    }

    render() {
        return (
            <Col xs={12}>
                <InputRange
                    minValue={this.props.min}
                    maxValue={this.props.max}
                    value={this.state.value}
                    onChange={value => this.setValue(value)}
                    // Users can only select multiples of 5 minutes
                    step={300000}
                    allowSameValues={false}
                    formatLabel={n => this.makeLabel(n)}
                    draggableTrack={true} />
            </Col>
        )
    }
}

export default AvailabilityWidget;