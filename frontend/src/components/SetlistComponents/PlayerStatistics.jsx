import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SortableTable from '@Components/SortableTable.jsx';
import {formatDuration} from '@Utils/DateTimeUtils.js';

function unionIn(target, otherSet){
    for(let el in otherSet){
        target.add(el);
    }
}

export default class PlayerStatistics extends Component{
    renderPlayerRow(playerStats){
        return (
            <tr key={playerStats.name}>
                <td>{playerStats.name}</td>
                <td>{Array.from(playerStats.instruments).join(', ')}</td>
                <td>{playerStats.songNum}</td>
                <td>{formatDuration(playerStats.playTime)}</td>
            </tr>
        )
    }
    render(){
        let playerStats = this.props.playerStats ? this.props.playerStats : [];
        const songTableHeaders = ['Naam','Instrumenten', 'Aantal nummers','Podiumtijd'];
        const tableSorters = {0: 'name', 2:'songNum', 3:'playTime'};
        return (
            <div>
                <SortableTable striped bordered condensed hover responsive 
                    headers={songTableHeaders} data={playerStats} sorters={tableSorters}>
                    {playerStats.map((stats)=>this.renderPlayerRow(stats))}
                </SortableTable>
            </div>
        );
    }
}

PlayerStatistics.propTypes = {
    colors: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
    playerStats : PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        songNum: PropTypes.number,
        playTime: PropTypes.number,
        instruments: PropTypes.instanceOf(Set)
    }))
};