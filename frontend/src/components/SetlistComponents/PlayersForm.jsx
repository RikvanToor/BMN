import React, {Component} from 'react';
import {Record, List} from 'immutable';
import PropTypes from 'prop-types';
import GlyphButton from '@Components/GlyphButton.jsx';
import {FormControl, Label, Row, Col, Button} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import {pullBottomStyle} from '@Components/UiHelpers.js';
import {Player} from '@Models/SetlistSong.js';
/**
 * The player form for a setlist song.
 */
export default class PlayersForm extends Component{
    constructor(props){
        super(props);
        let players = '';
        if(Array.isArray(this.props.players)){
            players = new List(this.props.players)
        }
        else if(this.props.players instanceof List){
            players = this.props.players.map((el)=>{
                if(el instanceof Player) return el;
                return new Player(el);
            });
        }
        else{
            players = new List([new Player({ind:0, id:props.possiblePlayers.get(0).id, name:props.possiblePlayers.get(0).name })]);
        }

        this.state = {
            players: players
        };

        this.removePlayer = this.removePlayer.bind(this);
        this.changeInstrument = this.changeInstrument.bind(this);
        this.addNewPlayer = this.addNewPlayer.bind(this);
        this.handleSave= this.handleSave.bind(this);
    }
    /**
     * Handles the saving action by invoking the onSave prop with all players.
     * @param {DOMEvent} e Button click action. 
     */
    handleSave(e){
        if(this.props.onSave){
            this.props.onSave(this.state.players);
        }
    }
    /**
     * Add a new player to the song
     */
    addNewPlayer(){
        this.setState({players: this.state.players.push(new Player())});
    }
    /**
     * Remove a player from the list
     * @param {SyntheticEvent} e 
     */
    removePlayer(e){
        let ind = e.target.dataset.ind;
        if(!ind) return;
        this.setState({players: this.state.players.delete(ind)});
    }
    /**
     * Update the selected player for an instrument
     * @param {integer} ind Index in the list of instrument/player combinations 
     * @param {Player} selectedPlayer The Player object for a setlist song 
     */
    updatePlayer(ind, selectedPlayer){
        console.log(selectedPlayer);
        this.setState({players: 
            this.state.players.setIn([ind, 'id'], selectedPlayer.id)
            .setIn([ind, 'name'], selectedPlayer.name)
        });
    }
    /**
     * Changes the instrument for  an entry
     * @param {SyntheticEvent} e Change event 
     */
    changeInstrument(e){
        //Acquire the index from the dataset on the element.
        let ind = e.target.dataset.ind;
        this.setState({
            players: this.state.players.setIn([ind,'instrument'], e.target.value)
        });
    }
    renderPlayer(playerObj, i, playerOpts, rowStyle){
        let ind = [playerObj.name];
        if(playerObj.ind == this.props.possiblePlayers.length - 1){
            ind == [];
        }
        return (
            <Row key={playerObj.name} style={rowStyle}>
                <Col xs={1} md={1} style={pullBottomStyle}>
                    <GlyphButton glyph="remove" color="red" data-ind={i} onClick={this.removePlayer}/>
                </Col>
                <Col xs={2} md={2} style={pullBottomStyle}>
                    <Label>Speler</Label>
                    <Typeahead options={playerOpts} selected={ind} onChange={(selected)=>{this.updatePlayer(i,selected[0]);}} labelKey="name"/>
                </Col>
                <Col xs={2} md={2} style={pullBottomStyle}>
                    <Label>Instrument</Label>
                    <FormControl className="inline" type="text" value={playerObj.instrument} data-ind={i} onChange={this.changeInstrument}/>
                </Col>
                <Col xs={1} md={1} style={pullBottomStyle}>
                    <GlyphButton glyph="plus" color="green" onClick={this.addNewPlayer}>Voeg nog een speler toe</GlyphButton>
                </Col>
            </Row> 
        );
    }
    render(){
        let playerOpts = Array.isArray(this.props.possiblePlayers) ? this.props.possiblePlayers : this.props.possiblePlayers.toJS();
        const rowStyle= {marginBottom:'15px'};
        return (
            <div style={{margin:'15px'}}>
                <Row style={rowStyle}>
                    <Col xs={3} md={3}><GlyphButton glyph="plus" color="green" onClick={this.addNewPlayer}>Nieuwe speler</GlyphButton></Col>
                </Row>
                {this.state.players.map((player,ind)=>this.renderPlayer(player,ind,playerOpts, rowStyle))}
                <Row style={rowStyle}>
                    <Col xs={1} md={1}><Button bsStyle="primary" onClick={this.handleSave}>Opslaan</Button></Col>
                </Row>
            </div>
        );
    }
}

PlayersForm.propTypes = {
    players : PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    possiblePlayers: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]).isRequired,
    onSave: PropTypes.func
}