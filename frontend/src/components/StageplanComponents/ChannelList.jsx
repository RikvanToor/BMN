import React, { Component } from 'react';

import { Table } from "react-bootstrap";

class ChannelList extends Component {
    render() { 
        return ( 
            <Table>
                <thead>
                    <tr>
                    <th>Kanaal</th>
                    <th>Bandlid</th>
                    <th>Instrument</th>
                    <th>Mic/ DI</th>
                    <th>Insert</th>
                    </tr>
                </thead>
            </Table>
         );
    }
}
 
export default ChannelList;