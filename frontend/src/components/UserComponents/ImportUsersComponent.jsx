import React, { Component, PureComponent } from "react";
import {Container} from 'flux/utils';
import { dispatch } from '@Services/AppDispatcher.js';
import PropTypes from 'prop-types';
import { changePassword } from '@Actions/PasswordActions.js'
import { Redirect } from 'react-router';
import { FormGroup, Form,  FormControl, Alert, ControlLabel, Button, HelpBlock} from 'react-bootstrap';
import {isEmptyString, isUndefined} from '@Utils/TypeChecks.js';

//Data import
import UserStore from '@Stores/UserStore.js';

/**
 * The login page. Since no state is needed, this is a Pure component that is rerendered
 * only when new properties are provided.
  */
export default class ImportUsersComponent extends Component {
  constructor(props) {
      super(props);

      this.state = {
        columns:[],
        nameCol:0,
        emailCol:1
      };
      
      //Bound functions
      this.handleImportUsers = this.handleImportUsers.bind(this);
      this.setColValue = this.setColValue.bind(this);
    }
    /**
     * Handle the import of users action
     */
    handleImportUsers(e){
      e.preventDefault();
      this.props.onImport(this.importUsersEl.files[0], this.state.nameCol, this.state.emailCol);
    }
    /**
     * Update the options for name and email columns when a file is selected
     */
    handleImportFileSelected(e){
      if(this.importUsersEl.files.length)
      {
          var reader = new FileReader();

          reader.onload = (e) =>
          {
              let lines = e.target.result.split('\n');
              let headers = lines[0].split(',').map(el=>el.trim());
              this.setState({columns: headers});
          };

          reader.readAsText(this.importUsersEl.files[0]);
      }
    }
    
    /**
     * Sets a selected column value
     */
    setColValue(e){
      let val = parseInt(e.target.value);
      this.setState({
        [e.target.id] : val
      });
    }
    
    /**
     * Render the component
     */
    render() {
      let columnSelection = null;
      if(this.state.columns.length > 0){
        //Create the options for the column selectors
        let options = this.state.columns.map((el,ind)=><option key={el} value={ind}>{el}</option>);
        columnSelection = (
          <React.Fragment>
            <FormGroup>
              <ControlLabel>Naam kolom</ControlLabel>
              <FormControl componentClass="select" id="nameCol" value={this.state.nameCol} onChange={this.setColValue}>
                      {options}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>E-mail kolom</ControlLabel>
              <FormControl componentClass="select" id="emailCol" value={this.state.emailCol} onChange={this.setColValue}>
                      {options}
              </FormControl>
            </FormGroup>
          </React.Fragment>
        );
      }
      
      return (
          <Form onSubmit={this.handleImportUsers}>
            <FormGroup>
            <ControlLabel>Bestand</ControlLabel>
            <FormControl type="file" inputRef={(ref)=>{this.importUsersEl = ref;}} id="usersFile" onChange={(e)=>this.handleImportFileSelected(e)}/>
            </FormGroup>
            {columnSelection}
            <Button type="submit">Importeren</Button>
          </Form>
      );
    }
}