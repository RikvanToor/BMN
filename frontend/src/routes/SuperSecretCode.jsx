import React, { Component } from "react";
import { draftToMarkdown } from 'markdown-draft-js';
import RichEditor from '@Components/RichEditor.jsx';
import CodeInputComponent from "@Components/CodeInputComponent.jsx";

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em'
  }
};

class SuperSecretCode extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
            <h3>Vul de code in</h3>
            <CodeInputComponent onSubmit={this.checkCode} inline/>
        </div>
    );
  }
}

export default SuperSecretCode;
