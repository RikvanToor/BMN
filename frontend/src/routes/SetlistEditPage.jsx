//UI imports
import React, {Component} from 'react';
import {Table, Label, Button, ButtonGroup, Modal, Panel, Tabs, Tab, FormControl, Form, ControlLabel, FormGroup} from 'react-bootstrap';
import PropTypes from 'prop-types';
import SetlistSongForm from '@Components/SetlistSongForm.jsx';
import PlayersForm from '@Components/SetlistComponents/PlayersForm.jsx';
import SortableTable from '@Components/SortableTable.jsx';
import PlayerStatistics from '@Components/SetlistComponents/PlayerStatistics.jsx';

//Data imports
import {Container} from 'flux/utils';
import SetlistSong from '@Models/SetlistSong.js';
import SetlistStore from '@Stores/SetlistStore.js';
import UsersStore from '@Stores/UsersStore.js';

//Interaction imports
import {getSetlistSongs, addSetlistSong, updateCrew, removeSetlistSong, publishSetlistSongs} from '@Actions/SetlistActions.js';
import {loadUsersAction} from '@Actions/UserActions.js';
import {deferredDispatch, dispatch} from '@Services/AppDispatcher.js';
import {formatDuration} from '@Utils/DateTimeUtils.js';
import * as ModalHelpers from '@Components/ModalHelpers.jsx';

class SetlistEditPage extends Component{
    constructor(props){
        super(props);
        this.handleNewSetlistSong = this.handleNewSetlistSong.bind(this);

        this.state = {
            edittingPlayersForSong : -1,
            songToDeleteInd : -1,
            modal: false
        }

        //Bound callbacks
        this.editCrew = this.editCrew.bind(this);
        this.publishAll = this.publishAll.bind(this);
        this.tryPublishAll = this.tryPublishAll.bind(this);
        this.deleteSong = this.deleteSong.bind(this);
        this.cancelDeleteSong = this.cancelDeleteSong.bind(this);
        this.startDeleteSong = this.startDeleteSong.bind(this);
        this.clearModal = this.clearModal.bind(this);
    }
    deleteSong(){
        dispatch(removeSetlistSong(this.props.setlist[this.state.songToDeleteInd]));
        this.setState({songToDeleteInd: -1, modal:false});
    }
    cancelDeleteSong(){
        this.setState({modal: false, songToDeleteInd: -1});
    }
    clearModal(){
        this.setState({modal:false});
    }
    startDeleteSong(e){
        let ind = e.target.dataset.ind;
        let modal = {
            body: (<p>Weet je zeker dat je {this.state.songToDeleteInd >= 0 ? this.props.setlist[ind].title:''} wil verwijderen?</p>),
            onCancel: this.cancelDeleteSong,
            onAccept: this.deleteSong,
            title: 'Nummer verwijderen'
        }
        this.setState({songToDeleteInd:ind, modal: modal});
    }
    /**
     * Saves the players for a song
     * @param {integer} songId Id of the song 
     * @param {List} crew List object of Player objects describing crew for the song 
     */
    saveCrew(songId, crew){
        let crewPlain = crew.toJS();
        crewPlain = crewPlain.reduce((accum,el)=>{
            //Filter entries without player.
            if(el.name.length !== 0){
                accum.push(el);
            }
            return accum;
        }, [])
        deferredDispatch(updateCrew(songId, crewPlain));
        //Close the editor
        this.stopEditting();
    }
    publishAll(){
        //All unpublished songs
        let unpublished = this.props.setlist.reduce((accum,song)=>{
            if(!song.isPublished) accum.push(song.id);
            return accum;
        },[]);

        //Publish them
        dispatch(publishSetlistSongs(unpublished));

        //Clear the modal
        this.clearModal();
    }
    tryPublishAll(){
        //All unpublished songs
        let unpublished = this.props.setlist.reduce((accum,song)=>{
            if(!song.isPublished) accum.push(song);
            return accum;
        },[]);

        if(unpublished.length === 0)
            return;

        //Ask user whether these songs should all be published.
        let modal = {
            body: (<React.Fragment>
                <p>Je gaat de volgende nummers publiceren:</p>
                <ul>
                {unpublished.map((el)=><li key={el.title}>{el.title}</li>)}
                </ul>
                <p>Klopt dat?</p>
                </React.Fragment>),
            onNo: this.clearModal,
            onYes: this.publishAll,
            title: 'Nummer verwijderen'
        };
        this.setState({modal:modal});
    }

    /**
     * Start editting the crew of a song
     * @param {SyntheticEvent} e Click event
     */
    editCrew(e){
        let ind = e.target.dataset.ind;
        this.setState({edittingPlayersForSong: ind});
    }

    stopEditting(e){
        this.setState({edittingPlayersForSong: -1});
    }

    /**
     * Prints the players in the format <player>(<instrument>) in <p> elements.
     * The laste element is placed in a span.
     * @param {array} players Array of player objects 
     */
    printPlayers(players){
        return (<span>
            {players.map((player,ind)=>{
                if(ind != players.length -1)
                    return (<p key={player.name}>{player.name}({player.instrument})</p>);
                return (<span key={player.name}>{player.name}({player.instrument})</span>);
            })}
            </span>);
    }

    /**
     * Renders a song entry in the setlist table
     * @param {object} song The SetlistSong object 
     * @param {integer} ind Index of the song in the table 
     */
    renderSetlistSong(song, ind){
        let label = (style, content)=>{return (<Label bsStyle={style}>{content}</Label>);}
        let ui = (
            <tr >
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{formatDuration(song.duration)}</td>
                <td>{song.players.length == 0 ? label('danger','Heeft nog geen bezetting') : this.printPlayers(song.players)}</td>
                <td>{song.isPublished ? label('success','Ja') : label('warning','Nee')}</td>
                <td>
                    <ButtonGroup>
                    <Button data-ind={ind} onClick={this.editCrew}>Bewerk bezetting</Button> 
                    <Button>Bewerk details</Button>
                    <Button data-ind={ind} onClick={this.startDeleteSong} bsStyle="danger">Verwijder</Button>
                    </ButtonGroup>
                </td>
            </tr>
        );
        let editForm = null;
        //Add the player edit form to edit the players for this song
        if(this.state.edittingPlayersForSong == ind){
            editForm = (<tr><td colSpan={6}><PlayersForm players={song.players} possiblePlayers={this.props.players} onSave={(players)=>{this.saveCrew(song.id, players);}}/></td></tr>);
        }

        return (
            <React.Fragment key={song.id}>
            {ui}
            {editForm}
            </React.Fragment>
        );
    }
    componentDidMount(){
        //Acquire all setlist songs
        deferredDispatch(getSetlistSongs());
        //Load users for modifying crew per song
        deferredDispatch(loadUsersAction());
    }
    
    /**
     * Handles creation of a new setlist song
     * @param {SetlistSong} song The setlist song object that was created 
     */
    handleNewSetlistSong(song){
        deferredDispatch(addSetlistSong(song));
    }
    
    renderPlayerStatistics(){
        //Accumulate player statistics from the setlist
        let playerStats = this.props.players.reduce((accum,player)=>{
          accum[player.id] = {id: player.id, name:player.name, instruments: new Set(), playTime: 0, songNum: 0};
          return accum;
        },{});
        if(Object.keys(playerStats).length === 0) return null;
                
        this.props.setlist.forEach((song)=>{
            if(song.players){
                //Make sure to count everybody once
                let seen = new Set();
                song.players.forEach((player)=>{
                    if(!seen.has(player.id)){
                        seen.add(player.id);

                        //Add data for player
                        playerStats[player.id].playTime += song.duration;
                        playerStats[player.id].instruments.add(player.instrument);
                        playerStats[player.id].songNum += 1;
                    }
                });
            }
        },{});
        playerStats = Object.values(playerStats);
        return (
            <PlayerStatistics playerStats={playerStats}/>
        );
    }

    render(){
        let modal = this.state.modal;

        let songTableHeaders = ['Titel','Artiest','Lengte','Bezetting','Gepubliceerd?','Acties'];
        let tableSorters = {0: 'title', 1: 'artist', 2:'duration', 4:'isPublished'};
        return (
            <div>
                <Tabs defaultActiveKey={1} animation={false} id="setlistTabs">
                    <Tab eventKey={1} title="Setlist">
                    <h4>Voeg een song toe</h4>
                    <SetlistSongForm song={new SetlistSong()} onSave={this.handleNewSetlistSong}/>
                    <h2>Huidige setlist</h2>
                    <Panel style={{padding:'15px'}}>
                        <p style={{display:'inline-block',paddingRight:'15px'}}><Label bsStyle="info">Acties: </Label></p>
                        <ButtonGroup>
                            <Button onClick={this.tryPublishAll}>Publiceer alle nummers</Button>
                        </ButtonGroup>
                    </Panel>
                    
                    <SortableTable striped bordered condensed hover responsive 
                        headers={songTableHeaders} data={this.props.setlist} sorters={tableSorters}>
                            {this.props.setlist.map((el,ind)=>this.renderSetlistSong(el,ind))}
                    </SortableTable>
                    </Tab>
                    <Tab eventKey={2} title="Nummers/Tijd per speler">
                        {this.renderPlayerStatistics()}
                    </Tab>
                </Tabs>
                
                {modal? ModalHelpers.yesNoModalFromObj(modal) : null}
            </div>
        );
    }
}
SetlistEditPage.propTypes = {
    setlist: PropTypes.array.isRequired
};
export default Container.createFunctional(
    (state) => (<SetlistEditPage setlist={state.setlist} players={state.players}/>),
    ()=> [SetlistStore, UsersStore],
    (prevState)=>{
        return {
            setlist:SetlistStore.setlist.toJS(), 
            players: UsersStore.users.map((user)=>{return {name:user.name, id:user.id};})
        };
    }
);