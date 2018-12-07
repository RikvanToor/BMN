import React, {Component} from 'react';
import {Form, FormControl, ControlLabel, FormGroup, Button} from 'react-bootstrap';
import FormattedTextField, {timeFormat} from '@Components/FormattedTextField.jsx';

export default class SetlistSongForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            title:'',
            artist:'',
            duration:0
        };
    }
    changeValue(e){
        let id = e.target.id;
        let newState = {};
        newState[id] = e.target.value;
        this.setState(newState);
    }
    renderFormEl(title, name, type, value, props){
        return (
            <FormGroup id={name}>
                <ControlLabel>{title}</ControlLabel>
                <FormControl type={type} value={value} {...props}/>
            </FormGroup>
        )
    }
    render(){
        const sharedProps = {
            onChange: this.changeValue.bind(this)
        };
        return (
            <Form inline>
                {this.renderFormEl('Titel','title','text',this.state.title, sharedProps)}
                {this.renderFormEl('Artiest','artist','text',this.state.title, sharedProps)}
                {this.renderFormEl('Lengte','duration','text',this.state.title, sharedProps)}
                <FormattedTextField format={timeFormat}/>
                <Button bsStyle="primary" type="submit">Opslaan</Button>
            </Form>
        );
    }
}