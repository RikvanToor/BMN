import React, {Component} from 'react';
import {Form, FormControl, ControlLabel, FormGroup, Button, Row, Col} from 'react-bootstrap';
import PropTypes from 'prop-types';
import DurationField from '@Components/DurationField.jsx';
import SetlistSong from '@Models/SetlistSong.js';
import * as TypeChecks from '@Utils/TypeChecks.js';

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
    renderFormEl(title, name, typeOrComponent, value, props){
        let control = null;
        if(TypeChecks.isString(typeOrComponent)){
            control =(<FormControl id={name} type={typeOrComponent} value={value} {...props}/>);
        }
        else{
            let Comp = typeOrComponent;
            control = (<Comp id={name} value={value} {...props}/>);
        }
        
        return (
            <FormGroup id={name}>
                <Col xs={3} md={3}> <ControlLabel>{title}</ControlLabel> </Col>
                <Col xs={9} md={9}> {control}</Col>
            </FormGroup>
        )
    }
    static formRow(leftElement, rightElement){
        return (
            <Row>
                <Col xs={6} md={6}>{leftElement}</Col>
                <Col xs={6} md={6}>{rightElement}</Col>
            </Row>
        );
    }
    render(){
        const sharedProps = {
            onChange: this.changeValue.bind(this)
        };
        //Use the formRow helper to avoid messing up the taborder (not the most efficient solution)
        return (
            <Form horizontal onSubmit={this.handleSave}>
            {SetlistSongForm.formRow(
                this.renderFormEl('Titel','title','text',this.state.song.title, sharedProps),
                this.renderFormEl('Artiest','artist','text',this.state.song.artist, sharedProps)
                )
            }
            {SetlistSongForm.formRow(
                this.renderFormEl('Lengte','duration',DurationField,this.state.song.duration,Object.assign({},sharedProps,{onValueChange:(val)=>{this.changeValueDirect('duration',val);}})),
                this.renderFormEl('Spotify link','spotifyLink','text',this.state.song.spotifyLink, sharedProps)
                )
            }
            {SetlistSongForm.formRow(
                this.renderFormEl('Opmerking','comment','text',this.state.song.comment, sharedProps),
                null
                )
            }
            <Button bsStyle="primary" type="submit">Opslaan</Button>
            </Form>
        );
    }
}

SetlistSongForm.propTypes = {
    song: PropTypes.object.isRequired,
    onSave: PropTypes.func
};