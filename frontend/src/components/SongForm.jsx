import React, {Component} from 'react';
import {Form, FormControl, ControlLabel, FormGroup, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Song from '@Models/Song.js';

export default class SongForm extends Component{
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
        this.setState({song: new Song()});
    }
    renderFormEl(title, name, type, value, props){
        return (
            <FormGroup id={name}>
                <ControlLabel>{title}</ControlLabel>
                <FormControl id={name} type={type} value={value} {...props}/>
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
                {this.renderFormEl('Genre','genre','text',this.state.song.genre, sharedProps)}
                {this.renderFormEl('Link','spotify_link','text',this.state.song.spotify_link, sharedProps)}
                <Button bsStyle="primary" type="submit">Opslaan</Button>
            </Form>
        );
    }
}

SongForm.propTypes = {
    song: PropTypes.object.isRequired,
    onSave: PropTypes.func
};