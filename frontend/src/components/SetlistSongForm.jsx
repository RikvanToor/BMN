import React, {Component} from 'react';
import {Form, FormControl, ControlLabel, FormGroup, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import FormattedTextField, {timeFormat} from '@Components/FormattedTextField.jsx';

export default class SetlistSongForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            song : props.song
        };
        this.handleSave = this.handleSave.bind(this);
    }
    changeValue(e){
        console.log(e.target);
        this.setState({song: this.state.song.set(e.currentTarget.id,e.target.value)});
    }
    handleSave(e){
        if(this.props.onSave){
            this.props.onSave(this.state.song);
        }
    }
    renderFormEl(title, name, type, value, props){
        return (
            <FormGroup id={name}>
                <ControlLabel>{title}</ControlLabel>
                <FormControl id={name} type={type} value={value} {...props}/>
            </FormGroup>
        )
    }
    renderCustomEl(title,name,component, value, props){
        let Comp = component;
        return (
            <FormGroup id={name}>
                <ControlLabel>{title}</ControlLabel>
                <Comp id={name} value={value} {...props}/>
            </FormGroup>
        )
    }
    render(){
        const sharedProps = {
            onChange: this.changeValue.bind(this)
        };
        return (
            <Form inline onSubmit={this.handleSave}>
                {this.renderFormEl('Titel','title','text',this.state.title, sharedProps)}
                {this.renderFormEl('Artiest','artist','text',this.state.title, sharedProps)}
                {this.renderCustomEl('Lengte','duration',FormattedTextField,this.state.title, Object.assign(sharedProps,{format:timeFormat}))}
                <Button bsStyle="primary" type="submit">Opslaan</Button>
            </Form>
        );
    }
}

SetlistSongForm.propTypes = {
    song: PropTypes.object.isRequired,
    onSave: PropTypes.func
};