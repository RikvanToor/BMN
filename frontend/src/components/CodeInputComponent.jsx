import React, { Component, PureComponent } from "react";
import {Container} from 'flux/utils';
import { dispatch } from '@Services/AppDispatcher.js';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { FormGroup, Form,  FormControl, Alert, ControlLabel, Button, HelpBlock} from 'react-bootstrap';
import {isEmptyString, isUndefined} from '@Utils/TypeChecks.js';

export default class CodeInputComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupId: '',
            code: '',
            codeError:!isUndefined(this.props.codeError) ? this.props.codeError : '',
            codeValid:!isUndefined(this.props.codeValid) ? this.props.codeValid : '',
        }
        this.inputChange = this.inputChange.bind(this);
    }

    inputChange(e) {
        let newState = {};
        newState[e.target.id] = e.target.value;
        this.setState(newState);
    }

    clearState() {
        this.setState({
            groupId: '',
            code: '',
            codeError: '',
        });
    }

    checkCode(e) {
        e.preventDefault();

        let group = this.state.groupId;
        let groupCode = this.state.code;
        if (group in [1, 2, 3, 4]) {
            switch (group) {
                // Arya vermoord de Night King in episode 3 season 8.
                // Ant man expand niet in Thanos zn anus
                case "1":
                    if (groupCode == "8943") {
                        this.setState({codeValid:'jaaa!'});
                        this.setState({codeError:''});
                    }
                    else {
                        this.setState({codeError:'Foute code!'});
                    }
                    break;
                case "2":
                    if (groupCode == "6620") {
                        this.setState({codeValid:'jaaa!'});
                        this.setState({codeError:''});
                    }
                    else {
                        this.setState({codeError:'Foute code!'});
                    }
                    break;
                case "3":
                    if (groupCode == "1039") {
                        this.setState({codeValid:'jaaa!'});
                        this.setState({codeError:''});
                    }
                    else {
                        this.setState({codeError:'Foute code!'});
                    }
                    break;
                case "4":
                    if (groupCode == "5282") {
                        this.setState({codeValid:'jaaa!'});
                        this.setState({codeError:''});
                    }
                    else {
                        this.setState({codeError:'Foute code!'});
                    }
                    break;
            }
        }
        else {
            this.setState({codeError:'Deze groep bestaat niet!'});
        }
    }

    render() {
        let {onSubmit, ...props} = this.props;
        return (
            <React.Fragment>
                <Form onSubmit={(e) => this.checkCode(e)} {...props}>
                    <FormGroup controlId="groupId">
                        <ControlLabel>Groeps nummer</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.groupId}
                            onChange={this.inputChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>
                    <FormGroup controlId = "code">
                        <ControlLabel>Code</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.code}
                            onChange={this.inputChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>
                    <Button bsStyle="primary" type="submit">Check!</Button>
                </Form>
                {!isEmptyString(this.state.codeError) ? (<p className="text-danger">{this.state.codeError}</p>) : null}
                {!isEmptyString(this.state.codeValid) ? (<Alert bsStyle="success">Code correct!</Alert>) : null}
            </React.Fragment>
        )
    }
}