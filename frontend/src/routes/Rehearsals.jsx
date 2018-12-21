import React, { Component } from "react";
import { deferredDispatch } from '@Services/AppDispatcher.js';
import { getScheduleAction, getScheduleForPlayerAction } from '@Actions/RehearsalActions.js'
import { Table, Tooltip, OverlayTrigger, Button, ButtonGroup, PageHeader } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { printTime } from '../GeneralExtensions.js';

/**
 * The rehearsals page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
 */
class RehearsalsPage extends Component {
    constructor(props) {
        super(props);
        this.fullStyle = 'primary';
        this.myStyle = 'default';
        this.state = { rehearsals: this.props.rehearsals, mode: Modes.ALL };
    }

    componentDidMount() {
        if (this.props.isLoggedIn) {
            deferredDispatch(getScheduleAction());
            this.setState({ rehearsals: this.props.rehearsals });
        }
    }

    getFullSchedule() {
        this.fullStyle = 'primary';
        this.myStyle = 'default';
        this.setState({ rehearsals: this.props.rehearsals, mode: Modes.ALL });
    }

    getMySchedule() {
        this.myStyle = 'primary';
        this.fullStyle = 'default';
        this.setState({ rehearsals: this.props.personalRehearsals, mode: Modes.OWN });
    }

    /**
     * Displays a player with the appropriate color according to their availabilities
     * Also adds a tooltip
     * @param {Player} player 
     * @param {Date} startTime 
     * @param {Date} endTime 
     */
    printName(player, startTime, endTime) {
        var classname = '';
        var tooltip = undefined;

        if (player.availabilities.length === 0) {
            // There are no availabilities, meaning the player has not uploaded their availabilities
            classname = 'text-warning';
            tooltip = player.name + ' heeft geen beschikbaarheid opgegeven';
        } else {
            var success = false;
            for (var a in player.availabilities) {
                var pstart = new Date(player.availabilities[a].pivot.start);
                var pend = new Date(player.availabilities[a].pivot.end);

                // The player is available during the whole song
                if (pstart <= startTime && pend >= endTime) {
                    success = true;
                    classname = 'text-success';
                    tooltip = player.name + ' is beschikbaar';
                    break;
                }
                // The player is partially available
                else if (pstart <= endTime && pend >= startTime) {
                    pstart = Math.max(pstart, startTime);
                    pend = Math.min(pend, endTime);
                    success = true;
                    classname = 'text-warning';
                    tooltip = player.name + ' is beschikbaar tussen ' + printTime(new Date(pstart)) + ' en ' + printTime(new Date(pend));
                    break;
                }
            }
            // The player is not available
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

    /**
     * Sets the set of rehearsals to the current state to be able to render both total and personal schedules
     * @param {Props} props 
     * @param {State} state 
     */
    static getDerivedStateFromProps(props, state) {
        state.rehearsals = state.mode === Modes.ALL ? props.rehearsals : props.personalRehearsals;
        return state;
    }

    render() {
        // For each rehearsallength
        var table = this.state.rehearsals.map(x => {
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
                            // For each song, create a row
                            x.songs.map(y => {
                                var songstart = new Date(y.pivot.start);
                                var songend = new Date(y.pivot.end);
                                return <tr key={y.id}>
                                    <td><LinkContainer to={'/nummer/' + y.id}><a>{y.artist} - {y.title}</a></LinkContainer></td>
                                    <td>{printTime(songstart)}</td>
                                    <td>{printTime(songend)}</td>
                                    <td>
                                        {
                                            // And print every player of the song
                                            y.players.map(z =>
                                                this.printName(z, songstart, songend)
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
                <PageHeader>
                    <div>Rooster</div>
                    <ButtonGroup>
                        <Button bsStyle={this.fullStyle} onClick={this.getFullSchedule.bind(this)}>Volledig rooster</Button>
                        <Button bsStyle={this.myStyle} onClick={this.getMySchedule.bind(this)}>Persoonlijk rooster</Button>
                    </ButtonGroup>
                </PageHeader>
                {table}
            </div>
        );
    }
}

const Modes = {
    ALL: 'ALL',
    OWN: 'OWN'
}

export default RehearsalsPage;