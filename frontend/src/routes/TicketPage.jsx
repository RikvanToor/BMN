import React, { Component } from "react";
import { draftToMarkdown } from 'markdown-draft-js';
import RichEditor from '@Components/RichEditor.jsx';

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em'
  }
};

class TicketPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var ticketStyle = {
        overflow: 'auto',
        border: '5px ridge blue'
    };

    return (
        <div> 
            <object type="text/html" data="https://www.a-eskwadraat.nl/Activiteiten/bmn/8581/BtaMusicNight2021/KaartjeKopen?cleanhtml=1" width="800px" height="600px" style={ticketStyle}>
            </object>
        </div>
    );
  }
}

export default TicketPage;
