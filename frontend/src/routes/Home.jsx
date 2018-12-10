import React, { Component } from "react";
import { draftToMarkdown } from 'markdown-draft-js';
import RichEditor from '@Components/RichEditor.jsx';

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em'
  }
};

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
            <h1>I'm home!</h1>
        <RichEditor/>
        </div>
    );
  }
}

export default Home;
