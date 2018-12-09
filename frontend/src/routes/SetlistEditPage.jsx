import React, {Component} from 'react';
import {Container} from 'flux/utils';
import {Table} from 'react-bootstrap';
import PropTypes from 'prop-types';
import SetlistSongForm from '@Components/SetlistSongForm.jsx';
import SetlistSong from '@Models/SetlistSong.js';
import SetlistStore from '@Stores/SetlistStore.js';
import {getSetlistSongs} from '@Actions/SetlistActions.js';
import {deferredDispatch} from '@Services/AppDispatcher.js';

class SetlistEditPage extends Component{
    renderSetlistSong(song){
        return (
            <tr key={song.title}>
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.duration}</td>
                <td></td>
                <td></td>
            </tr>
        );
    }
    componentDidMount(){
        deferredDispatch(getSetlistSongs());
    }
    render(){
        return (
            <div>
                <h2>Setlist bewerken</h2>
                <h4>Voeg een song toe</h4>
                <SetlistSongForm song={new SetlistSong()}/>
                <h4>Huidige setlist</h4>
                <Table striped bordered condensed hover responsive>
                    <thead>
                        <tr>
                            <td>Titel</td>
                            <td>Artiest</td>
                            <td>Lengte</td>
                            <td>Bezetting</td>
                            <td>Gepubliceerd?</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.setlist.map((el)=>this.renderSetlistSong(el))}
                    </tbody>
                </Table>
            </div>
        );
    }
}
SetlistEditPage.propTypes = {
    setlist: PropTypes.array.isRequired
};
export default Container.createFunctional(
    (state) => (<SetlistEditPage setlist={state.setlist} />),
    ()=> [SetlistStore],
    (prevState)=>{
        return {setlist:SetlistStore.setlist.toJS()};
    }
);