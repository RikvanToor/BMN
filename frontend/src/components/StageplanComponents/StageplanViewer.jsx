import React, { Component } from 'react';
import {
  ToggleButtonGroup, ToggleButton, Button, Popover, OverlayTrigger, ButtonGroup,
} from 'react-bootstrap';
import SvgVector from '@Components/StageplanComponents/SvgVector.js';
import Form, { FormField, SubmitButton } from '@Components/Form.jsx';
import SvgContext from '@Components/StageplanComponents/SvgContext.js';
import GeometryManipulator, { ManipulateModes } from '@Components/StageplanComponents/GeometryManipulator.js';
import StagePosition from '@Models/StagePlan/StagePosition.js';
import Instrument from '@Models/StagePlan/Instrument.js';
import Geometry from './Geometry.js';
import StageplanCanvas from './StageplanCanvas.jsx';

// Models

// Icons
import RotateIcon from './Assets/Icons/rotate.svg';
import SelectIcon from './Assets/Icons/select.svg';
import ScaleIcon from './Assets/Icons/scale.svg';
import TranslateIcon from './Assets/Icons/translate.svg';
import CrosshairIcon from './Assets/Icons/crosshair.svg';

/**
 * Instrument names. Key should mimic supported elements in
 * StageplanCanvas's "componentMap".
 */
const instruments = {
  keys: 'Keys',
  guitar: 'Gitaar',
  bass: 'Bas',
  acousticGuitar: 'Akoestische gitaar',
  violin: 'Viool',
  trumpet: 'Trompet',
  saxophone: 'Saxofoon',
  amp: 'Amp',
  drums: 'Drums',
  monitor: 'Monitor',
  elevation: 'Verhoging',
};

class StageplanViewer extends Component {
  constructor(props) {
    super(props);
    this.test = 2;

    // Outside state to avoid updating all children
    this.prevPos = new SvgVector();
    this.selection = null;
    this.manipulating = false;

    this.geomManip = new GeometryManipulator(ManipulateModes.SELECT);
    this.state = {
      showNames: false,
      manipulationMode: ManipulateModes.SELECT,
      members: {},
      instruments: {},
      activeManip: this.geomManip,
      selectionName: '',
      selectionId: '',
    };

    // Manipulation handlers
    this.onMove = this.onMove.bind(this);
    this.onDown = this.onDown.bind(this);
    this.onUp = this.onUp.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    // Actions
    this.addBandMember = this.addBandMember.bind(this);
    this.addInstrument = this.addInstrument.bind(this);
    this.changeMode = this.changeMode.bind(this);


    this.layoutListeners = [];
  }

  getUniqueInstrumentId(prefix) {
    let id = prefix;
    if (id in this.state.instruments) {
      let cnt = 0;
      id = prefix + cnt;
      // Bruteforce search
      while (id in this.state.instruments) {
        cnt++;
        id = prefix + cnt;
      }
    }
    return id;
  }

  /**
     * Changes the manipulation mode of the GeometryManipulator
     * @param {integer} newMode One of the ManipulateModes.
     */
  changeMode(newMode) {
    this.setState({ manipulationMode: newMode });
    this.geomManip.mode = newMode;
  }

  addInstrument(formData) {
    console.log(formData);
    const id = this.getUniqueInstrumentId(formData.instrument.value);
    const instruments = this.state.instruments;
    instruments[id] = new Instrument(formData.name.value, id, formData.instrument.value, Geometry.translate(20, 50));
    console.log(instruments);
    this.setState({ instruments });
  }

  addBandMember(formData) {
    const name = formData.bandmemberName.value;
    const member = new StagePosition(name, Geometry.translate(20, 50));
    if (!(name in this.state.members)) {
      const set = this.state.members;
      set[name] = member;
      this.setState({ members: set });
    }
  }

  registerLayoutListener(listener) {
    this.layoutListeners.push(listener);
  }

  setDragableSelection(e, node) {
    if (this.state.activeManip.setSelection(node, e)) {
      this.setState({ selectionId: node.props.id, selectionName: node.props.name });
      return true;
    }
    return false;
  }

  componentDidMount() {
    // Trigger layout
    this.layoutListeners.forEach((l) => {
      l(this);
    });
  }

  onKeyUp(e) {
    const key = e.key;
    if (key === 's') {
      this.changeMode(ManipulateModes.SCALE);
    } else if (key === 'r') {
      this.changeMode(ManipulateModes.ROTATE);
    } else if (key === 't') {
      this.changeMode(ManipulateModes.TRANSLATE);
    } else if (key === 'q') {
      this.changeMode(ManipulateModes.SELECT);
    }
  }

  onUp(e) {
    this.state.activeManip.onUp(e);
  }

  onDown(e) {
    this.state.activeManip.onDown(e);
  }

  onMove(e) {
    this.state.activeManip.onMove(e);
  }

  render() {
    const instrumentOpts = Object.keys(instruments).map(el => ({ name: instruments[el], value: el }));

    const addBandMemberForm = (
      <Popover id="addBandMemberPopover">
        <Form onSubmit={this.addBandMember}>
          <FormField label="Bandlid naam" id="bandmemberName" />
          <SubmitButton>Voeg toe</SubmitButton>
        </Form>
      </Popover>
    );
    const addInstrumentForm = (
      <Popover id="addBandMemberPopover">
        <Form onSubmit={this.addInstrument}>
          <FormField label="Naam" id="name" type="text" />
          <FormField label="Instrument" id="instrument" type="select" options={instrumentOpts} />
          <SubmitButton>Voeg instrument toe</SubmitButton>
        </Form>
      </Popover>
    );

    return (
      <React.Fragment>
        <div style={{ marginBottom: '15px' }}>
          <ButtonGroup>
            <OverlayTrigger trigger="click" placement="bottom" rootClose overlay={addBandMemberForm}>
              <Button>Voeg bandlid toe</Button>
            </OverlayTrigger>
            <OverlayTrigger trigger="click" placement="bottom" rootClose overlay={addInstrumentForm}>
              <Button>Voeg instrument toe</Button>
            </OverlayTrigger>
          </ButtonGroup>
        </div>
        <ToggleButtonGroup type="radio" name="mode" value={this.state.manipulationMode} onChange={this.changeMode}>
          <ToggleButton value={ManipulateModes.SELECT}><SelectIcon /></ToggleButton>
          <ToggleButton value={ManipulateModes.TRANSLATE}><TranslateIcon /></ToggleButton>
          <ToggleButton value={ManipulateModes.ROTATE}><RotateIcon /></ToggleButton>
          <ToggleButton value={ManipulateModes.SCALE}><ScaleIcon /></ToggleButton>
          <ToggleButton value={5}><CrosshairIcon /></ToggleButton>
        </ToggleButtonGroup>
        <div style={{ display: 'inlineBlock' }}>
          <span style={{ fontWeight: 'bold' }}> Geselecteerd: ID: {this.state.selectionId} , Naam: {this.state.selectionName}</span>
        </div>
        <div tabIndex="0" onKeyUp={this.onKeyUp} onMouseDown={this.onDown} onMouseUp={this.onUp} onMouseMove={this.onMove}>
          <SvgContext.Provider value={this}>
            <StageplanCanvas width="100%" height="480" members={Object.values(this.state.members)} instruments={Object.values(this.state.instruments)} />
          </SvgContext.Provider>
        </div>
      </React.Fragment>
    );
  }
}

export default StageplanViewer;
