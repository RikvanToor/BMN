import React, {Component} from 'react';
import {Form, FormControl, ControlLabel, FormGroup, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import DurationField from '@Components/DurationField.jsx';
import SetlistSong from '@Models/SetlistSong.js';

export default class SetlistSongForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            song : props.song
        };
        this.handleSave = this.handleSave.bind(this);
    }
    changeValue(e){
        this.setState({song: this.state.song.set(e.currentTarget.id,e.target.value)});
    }
    changeValueDirect(id, val){
        this.setState({song: this.state.song.set(id,val)});
    }
    handleSave(e){
        if(this.props.onSave){
            this.props.onSave(this.state.song);
        }
        e.preventDefault();
        this.setState({song: new SetlistSong()});
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
                {this.renderFormEl('Titel','title','text',this.state.song.title, sharedProps)}
                {this.renderFormEl('Artiest','artist','text',this.state.song.artist, sharedProps)}
                {this.renderCustomEl('Lengte','duration',DurationField,this.state.song.duration,{onValueChange:(val)=>{this.changeValueDirect('duration',val);}})}
                <Button bsStyle="primary" type="submit">Opslaan</Button>
            </Form>
        );
    }
}

SetlistSongForm.propTypes = {
    song: PropTypes.object.isRequired,
    onSave: PropTypes.func
};