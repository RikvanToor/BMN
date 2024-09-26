import React, { Component } from "react";
import { draftToMarkdown } from 'markdown-draft-js';
import RichEditor from '@Components/RichEditor.jsx';

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em'
  }
};

class AuditionsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var ticketStyle = {
        overflow: 'auto',
        //border: '5px ridge blue'
    };

    return (
        <div> 
            <object type="text/html" data="https://forms.gle/g66d8TLx1Y5d6k3v7" width="100%" height="700px" style={ticketStyle}>
            </object>
        </div>
    );
  }
}

export default AuditionsPage;
