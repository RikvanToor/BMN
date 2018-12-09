//React library imports
import React, { Component } from "react";
import PropTypes from 'prop-types';

//UI imports
import Carousel from "../components/carousel.jsx";
import ConditionalComponent from '@Components/ConditionalComponent.jsx';
import ConditionalComponet from '@Components/ConditionalComponent.jsx';
import { ButtonToolbar, ButtonGroup, Button, Glyphicon, Table, Checkbox, PageHeader } from 'react-bootstrap';
import RehearsalForm from '@Components/RehearsalForm.jsx';
import RehearsalSongsForm from '@Components/RehearsalSongsForm.jsx';

//Data imports
import { Container } from 'flux/utils';
import UserStore from '@Stores/UserStore.js';
import { deferredDispatch, dispatch } from '@Services/AppDispatcher.js';
import RehearsalManipulationStore, { loadAllRehearsals } from '@Stores/RehearsalManipulationStore.js';
import RehearsalStore from '@Stores/RehearsalStore.js';
import { getScheduleAction, createRehearsals, deleteRehearsals, getAllAvailabilities } from '@Actions/RehearsalActions.js';

//Utils
import * as typeChecks from '@Utils/TypeChecks.js';
//Datetime formatting functions
import { readableDate, readableTime } from '@Utils/DateTimeUtils.js';

class RehearsalEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = { showRehearsalDayForm: false, selectedRehearsalDays: new Set() };

    //Bound callbacks
    this.hideRehearsalCreation = this.hideRehearsalCreation.bind(this);
    this.startRehearsalAdd = this.startRehearsalAdd.bind(this);
    this.saveNewRehearsals = this.saveNewRehearsals.bind(this);
    this.removeRehearsals = this.removeRehearsals.bind(this);
  }
  toggleRehearsalForm(visible) {
    if (this.state.showRehearsalDayForm === visible) return;

    this.setState({
      showRehearsalDayForm: visible
    });
  }
  componentDidMount() {
    //Load rehearsals  
    deferredDispatch(getScheduleAction());
    deferredDispatch(getAllAvailabilities());
  }
  removeRehearsals() {
    if (this.state.selectedRehearsalDays.size > 0) {
      dispatch(deleteRehearsals(Array.from(this.state.selectedRehearsalDays)));

      //Clear selection
      this.setState({ selectedRehearsalDays: new Set() });
    }
  }

  startRehearsalAdd(e) {
    this.toggleRehearsalForm(true);
  }
  /**
   * Saves newly created rehearsals. Closes the rehearsal form
   * @param {List|array} rehearsals The rehearsals to create
   */
  saveNewRehearsals(rehearsals) {
    dispatch(createRehearsals(rehearsals));
    this.toggleRehearsalForm(false);
  }
  /**
   * Selects a rehearsal from the currently available rehearsals
   * @param {type} e The event triggered by the selection checkbox
   * @param {type} id The ID of the rehearsal to select
   */
  selectRehearsal(e, id) {
    let add = e.target.checked;
    let set = this.state.selectedRehearsalDays;
    if (add) {
      set.add(id);
    }
    else {
      set.delete(id);
    }
    this.setState({ selectedRehearsalDays: set });
  }

  hideRehearsalCreation() {
    this.toggleRehearsalForm(false);
  }

  render() {
    return (
      <div>
        <PageHeader>Repetitiedagen</PageHeader>
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={this.startRehearsalAdd}><Glyphicon glyph="plus" style={{ color: 'green', marginRight: '5px' }} />Nieuwe repetitiedag(en)</Button>
            <Button onClick={this.removeRehearsals}><Glyphicon glyph="minus" style={{ color: 'red' }} />Verwijder repetitiedag</Button>
          </ButtonGroup>
        </ButtonToolbar>
        <ConditionalComponent condition={this.state.showRehearsalDayForm}>
          <RehearsalForm onCancel={this.hideRehearsalCreation} onSave={this.saveNewRehearsals} />
        </ConditionalComponent>
        <Table striped bordered condensed hover responsive style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Datum</th>
              <th>Locatie</th>
              <th>Begintijd</th>
              <th>Eindtijd</th>
              <th>Nummers</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.rehearsals.valueSeq().map((obj) => {
                const hasSongs = 'songs' in obj && obj.songs.length > 0;
                const songText = hasSongs ? obj.songs.map((el) => el.title).join('<br/>') : 'Nog geen';

                return (<React.Fragment key={obj.start}><tr>
                  <td><Checkbox checked={this.state.selectedRehearsalDays.has(obj.id)} onChange={(e) => this.selectRehearsal(e, obj.id)} /></td>
                  <td>{readableDate(new Date(obj.start))}</td>
                  <td>{obj.location}</td>
                  <td>{readableTime(new Date(obj.start))}</td>
                  <td>{readableTime(new Date(obj.end))}</td>
                  <td>{songText}</td>
                </tr><tr><td colSpan="6">
                  <RehearsalSongsForm songs={[{ id: 0, title: 'Song1' }, { id: 1, title: 'Song2' }]} startTime={1800} endTime={2100} />
                </td></tr></React.Fragment>);
              })
            }
          </tbody>
        </Table>
      </div>
    );
  }
};

//Setup proptypes for development checking
RehearsalEditPage.propTypes = {
  isAdmin: PropTypes.bool.isRequired
};

//Wrap the page in a Flux container that relays data from stores
export default Container.createFunctional(
  (state) => (<RehearsalEditPage isAdmin={state.isAdmin} rehearsals={state.rehearsals} />), //View function

  () => [UserStore, RehearsalManipulationStore, RehearsalStore], //Required stores

  (prevState) => { //Determine the state needed
    return { isAdmin: UserStore.user.isCommittee, rehearsals: RehearsalStore.rehearsals };
  }
);