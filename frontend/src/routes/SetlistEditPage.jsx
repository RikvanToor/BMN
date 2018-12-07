import React, {Component} from 'react';
import {Container} from 'flux/utils';
import {Table} from 'react-bootstrap';
import PropTypes from 'prop-types';
import SetlistSongForm from '@Components/SetlistSongForm.jsx';
import SetlistStore from '@Stores/SetlistStore.js';
class SetlistEditPage extends Component{
    renderSetlistSong(song){
        return (
            <tr key={song.title}>
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.duration}</td>
            </tr>
        );
    }
    render(){
        return (
            <div>
                <h2>Setlist bewerken</h2>
                <h4>Voeg een song toe</h4>
                <SetlistSongForm/>
                <h4>Huidige setlist</h4>
                <Table>
                    <thead>
                        <tr>
                            <td>Titel</td>
                            <td>Artiest</td>
                            <td>Lengte</td>
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
    (state) => (<SetlistEditPage setlist={[]} />),
    ()=> [SetlistStore],
    (prevState)=>{
        return {};
    }
);