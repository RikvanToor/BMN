import React, { Component } from "react";
import { draftToMarkdown } from 'markdown-draft-js';
import RichEditor from '@Components/RichEditor.jsx';

const styles = {
    editor: {
        border: '1px solid gray',
        minHeight: '6em'
    }
};

class TicketPurchaseLanding extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>Aankoop geslaagd! Wij hopen u 5 juni te zien bij de Helling!</h2>
            </div>
        );
    }
}

export default TicketPurchaseLanding;