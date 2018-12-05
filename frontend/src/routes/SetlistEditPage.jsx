import React, {Cmomponent} from 'react';
import {Container} from 'flux/utils';
import {Table} from 'react-bootstrap';
import PropTypes from 'prop-types';
class SetlistEditPage extends Component{
    render(){
        return (
            <div>
                <h2>Setlist bewerken</h2>
                <h4>Voeg een song toe</h4>
                <h4>Huidige setlist</h4>
                <Table>
                    <thead>

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