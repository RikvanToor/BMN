import React, { Component, PureComponent } from "react";
import {dispatch} from '@Services/AppDispatcher.js';
import {getRehearsalsAction} from '@Actions/RehearsalActions.js'
import {Grid, Table} from 'react-bootstrap';

/**
 * The rehearsals page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
class RehearsalsPage extends PureComponent {

    componentDidMount(){
        dispatch(getRehearsalsAction());
    }
    
    render() {
        var r = this.props.rehearsals.map(x => {
            var startTime = new Date(x.start);
            var endTime = new Date(x.end);
            function printTime(d) {
                return d.toLocaleTimeString('nl-nl', { hour: '2-digit', minute: '2-digit' });
            }
            
        return (<div key={x.id}>
                <h3>{ startTime.toLocaleDateString('nl-nl', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                <h4>{printTime(startTime)}-{printTime(endTime)} @ {x.location}</h4>
                <Table striped bordered condensed hover responsive>
                    <thead>
                        <tr>
                            <th>Nummer</th>
                            <th>Begintijd</th>
                            <th>Eindtijd</th>
                            <th>Deelnemers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            x.songs.map(y => 
                                <tr key={y.id}>
                                    <td>{y.artist} - {y.title}</td>
                                    <td>{printTime(new Date(y.pivot.start))}</td>
                                    <td>{printTime(new Date(y.pivot.end))}</td>
                                    <td>{
                                        y.players.map(z =>
                                            <p key={z.id}>{z.name} ({z.pivot.instrument})</p>
                                        )
                                    }</td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </div>)
        });
        
        return (
            <Grid>
                {r}
            </Grid>
        );
    }
}

export default RehearsalsPage;