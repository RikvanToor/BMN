import React, { PureComponent } from "react";
import { deferredDispatch } from '@Services/AppDispatcher.js';
import { getSongsAction } from '@Actions/SongActions.js';
import { Table } from 'react-bootstrap';

/**
 * The songs page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
 */
class SongsPage extends PureComponent {

  componentDidMount() {
    if (this.props.isLoggedIn)
      deferredDispatch(getSongsAction())
  }

  render() {
    return 'hoi';
  }
}

export default SongsPage;