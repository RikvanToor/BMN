import React, { Component, PureComponent } from "react";
import { dispatch } from '@Services/AppDispatcher.js';
import { getScheduleAction, getScheduleForPlayerAction } from '@Actions/RehearsalActions.js'
import { Redirect } from 'react-router'
import { Grid, Table, Tooltip, OverlayTrigger, Button, ButtonGroup } from 'react-bootstrap';

/**
 * The rehearsals page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
class RehearsalsPage extends PureComponent {
    constructor(props) {
        super(props);
        this.fullStyle = 'primary';
        this.myStyle = 'default';
        this.getFullSchedule = this.getFullSchedule.bind(this);
        this.getMySchedule = this.getMySchedule.bind(this);
    }

    componentDidMount() {
        if(this.props.isLoggedIn)
            this.getFullSchedule();
    }

    getFullSchedule() {
        dispatch(getScheduleAction());
        this.fullStyle = 'primary';
        this.myStyle = 'default';
    }

    getMySchedule() {
        dispatch(getScheduleForPlayerAction(this.props.userid));
        this.myStyle = 'primary';
        this.fullStyle = 'default';
    }


    render() {
        if (!this.props.isLoggedIn) {
            return (<Redirect to='/login' />);
        }

        /**
         * Returns a Date object as string in the format 'hh:mm'
         * @param {Date} d 
         */
        function printTime(d) {
            return d.toLocaleTimeString('nl-nl', { hour: '2-digit', minute: '2-digit' });
        }

        /**
         * Displays a player with the appropriate color according to their availabilities
         * Also adds a tooltip
         * @param {Player} player 
         * @param {Date} startTime 
         * @param {Date} endTime 
         */
        function printName(player, startTime, endTime) {
            var classname = '';
            var tooltip = undefined;

            if (player.availabilities.length === 0) {
                // There 
                classname = 'text-warning';
                tooltip = player.name + ' heeft geen beschikbaarheid opgegeven';
            } else {
                var success = false;
                for (var a in player.availabilities) {
                    var pstart = new Date(player.availabilities[a].pivot.start);
                    var pend = new Date(player.availabilities[a].pivot.end);

                    if (pstart <= startTime && pend >= endTime) {
                        success = true;
                        classname = 'text-success';
                        tooltip = player.name + ' is beschikbaar';
                        break;
                    } 
                    else if (pstart <= endTime && pend >= startTime) {
                        pstart = Math.max(pstart, startTime);
                        pend = Math.min(pend, endTime);
                        success = true;
                        classname = 'text-warning';
                        tooltip = player.name + ' is beschikbaar tussen ' + printTime(new Date(pstart)) + ' en ' + printTime(new Date(pend));
                        break;
                    }
                }
                if (!success) {
                    classname = 'text-danger';
                    tooltip = player.name + ' is niet beschikbaar';
                }
            }

            var text = <p className={classname} key={player.id}>{player.name} ({player.pivot.instrument})</p>

            if (tooltip) {
                var overlay = <Tooltip id={'tooltip_' + player.id} key={player.id}>{tooltip}</Tooltip>
                text = <OverlayTrigger placement='top' key={player.id} overlay={overlay}>{text}</OverlayTrigger>
            }

            return text;
        }

        var r = this.props.rehearsals.map(x => {
            var startTime = new Date(x.start);
            var endTime = new Date(x.end);

            return (<div key={x.id}>
                <h3>{startTime.toLocaleDateString('nl-nl', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
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
                                {
                                    var songstart = new Date(y.pivot.start);
                                    var songend = new Date(y.pivot.end);
                                    return <tr key={y.id}>
                                        <td>{y.artist} - {y.title}</td>
                                        <td>{printTime(songstart)}</td>
                                        <td>{printTime(songend)}</td>
                                        <td>
                                            {
                                                y.players.map(z =>
                                                    printName(z, songstart, songend)
                                                )
                                            }
                                        </td>
                                    </tr>
                                }
                            )
                        }
                    </tbody>
                </Table>
            </div>)
        });

        return (
            <div>
                <ButtonGroup>
                    <Button bsStyle={this.myStyle} onClick={this.getMySchedule}>Persoonlijk rooster</Button>
                    <Button bsStyle={this.fullStyle} onClick={this.getFullSchedule}>Volledig rooster</Button>
                </ButtonGroup>
                {r}
            </div>
        );
    }
}

export default RehearsalsPage;