//UI imports
import React, {Component} from 'react';
import {Table, Label, PageHeader, Button, ButtonGroup, Modal, Panel} from 'react-bootstrap';
import PropTypes from 'prop-types';
import SongForm from '@Components/SongForm.jsx';

//Data imports
import {Container} from 'flux/utils';
import Song from '@Models/Song.js';
import SongsStore from '@Stores/SongsStore.js';

//Interaction imports
import {addSongAction} from '@Actions/SongActions.js';
import {deferredDispatch, dispatch} from '@Services/AppDispatcher.js';

class AddSuggestionPage extends Component{
    constructor(props){
        super(props);
        this.handleNewSong = this.handleNewSong.bind(this);

        this.state = {
            modal: false
        }

        //Bound callback
        this.clearModal = this.clearModal.bind(this);
    }
    clearModal(){
        this.setState({modal:false});
    }
    /**
     * Handles creation of a new suggestion
     * @param {Song} song The song object that was created 
     */
    handleNewSong(song){
        deferredDispatch(addSongAction(song.toJS()));
        let modal = {
            body: ( <React.Fragment>
                    <p>Je suggestie is nu toegevoegd aan de suggestielijst, de commissie zal er bij de volgende vergadering naar luisteren!</p>
                    </React.Fragment>),
            title: 'Hoera!',
            onAccept: this.clearModal
        };
        this.setState({modal:modal});
    }
     /**
     * Displays a modal
     * @param {string} title 
     * @param {React element} body 
     * @param {function} onAccept 
     */
    displayModal(title, body, onAccept){
        return (
            <Modal show={true}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {body}
                </Modal.Body>

                <Modal.Footer>
                    <Button bsStyle="primary" onClick={onAccept}>OK!</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render(){
        let modal = this.state.modal;

        return(
            <div>
                <PageHeader>Suggestie toevoegen</PageHeader>
                <SongForm song={new Song()} onSave={this.handleNewSong}/>
                {modal? this.displayModal(modal.title,modal.body, modal.onAccept) : null}
            </div>
        );
    }
}
AddSuggestionPage.propTypes = {
    song: PropTypes.object.isRequired
};
export default Container.createFunctional(
    (state) => (<AddSuggestionPage song={state.song} />),
    ()=> [SongsStore],
    (prevState)=>{
        return {
            song:SongsStore.song, 
        };
    }
);