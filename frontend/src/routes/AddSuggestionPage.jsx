//UI imports
import React, {Component} from 'react';
import {Table, Label, Button, ButtonGroup, Modal, Panel, PageHeader} from 'react-bootstrap';
import PropTypes from 'prop-types';
import SongForm from '@Components/SongForm.jsx';

//Data imports
import {Container} from 'flux/utils';
import Song from '@Models/Song.js';
import SongsStore from '@Stores/SongsStore.js';

//Interaction imports
import {getSongs, addSong, updateSong, updateSongs} from '@Actions/SongActions.js';
import {deferredDispatch, dispatch} from '@Services/AppDispatcher.js';
import {formatDuration} from '@Utils/DateTimeUtils.js';

class AddSuggestionPage extends Component{
    constructor(props){
        super(props);
        this.handleNewSong = this.handleNewSong.bind(this);

        this.state = {
            modal: false
        }
    }

    /**
     * Handles creation of a new suggestion
     * @param {Song} song The song object that was created 
     */
    handleNewSong(song){
        deferredDispatch(addSong(song.toJS()));
    }

    render(){
        return(
            <div>
                <PageHeader>Suggestie toevoegen</PageHeader>
                <SongForm song={new Song()} onSave={this.handleNewSong}/>
            </div>
        );
    }
}

export default Container.createFunctional(
    (state) => (<AddSuggestionPage song={state.song} />),
    ()=> [SongsStore],
    (prevState)=>{
        return {
            song:SongsStore.song, 
        };
    }
);