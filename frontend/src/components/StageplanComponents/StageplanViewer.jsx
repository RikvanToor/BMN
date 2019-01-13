import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dispatcher } from 'flux';

// Models
import StagePosition from '@Models/Stageplan/StagePosition.js';
import Instrument from '@Models/Stageplan/Instrument.js';
import Geometry from '@Models/Stageplan/Geometry.js';

// Manipulation
import GeometryManipulator from './Manipulation/GeometryManipulator';
import ManipulateModes from './Manipulation/ManipulateModes';
import SelectionHandler from './Manipulation/SelectionHandler';
import OrderManipulator from './Manipulation/OrderManipulator';
import { Map, List, Record } from 'immutable';

// UI
import {Modal} from 'react-bootstrap';
import StageplanCanvas from './StageplanCanvas.jsx';
import StageplanToolbar from './StageplanToolbar.jsx';
import {ButtonGroup, Button} from 'react-bootstrap';
// SVG components
import SvgContext from './SvgContext.js';
import SvgMenu from './SvgMenu.jsx';

// Models
const hotkeyMap = {
  s: ManipulateModes.SCALE,
  q: ManipulateModes.SELECT,
  r: ManipulateModes.ROTATE,
  t: ManipulateModes.TRANSLATE,
  p: ManipulateModes.PLACE_MARKER,
};

const modals = {
  DELETE_ELEMENT: 0,
  CHANGE_NAME: 1,
  ADD_ROLE: 2,
};

// eslint-disable-next-line react/no-multi-comp
class StageplanViewer extends Component {
  constructor(props) {
    super(props);

    this.svg = React.createRef();

    // Selection handler
    this.selectHandler = new SelectionHandler(ManipulateModes.SELECT);
    // Geomery manipulation handler
    this.geomManip = new GeometryManipulator(ManipulateModes.SELECT, this.selectHandler, this.commitManipulation.bind(this));

    // Order manipulator
    this.orderManpulator = new OrderManipulator(this.selectHandler, {
      openMenu: (pos, items) => {
        this.setState({ menu: { name: 'context', items, pos } });
      },
      closeMenu: () => this.setState({ menu: null }),
      addOrderAction: (action) => {
        const ordering = this.state.ordering;
        ordering.applyOrderAction(action);
        this.setState({ changedOrder: this.state.changedOrder.push(action), ordering });
      },
    });


    this.state = {
      showNames: false,
      manipulationMode: ManipulateModes.SELECT,
      selected: {},
      selectedIds: [],
      dirtyElements: new Map(),
      ordering: props.ordering,
      // Saved order actions
      changedOrder: new List(),
      menu: null,
      modal: -1,
    };


    // Manipulation handlers
    this.handlers = {
      onMouseMove: (e) => {
        this.geomManip.onMove(e);
      },
      onMouseDown: (e) => {
        this.geomManip.onDown(e);
      },
      onMouseUp: (e) => {
        this.geomManip.onUp(e);
      },
      onKeyUp: (e) => {
        if (e.key in hotkeyMap) {
          this.changeMode(hotkeyMap[e.key]);
        }
      },
      onClick: (e) => {
        this.orderManpulator.onClick(e);
      },
      onContextMenu: (e) => {
        // Disable browser contextmenu on the SVG element
        e.preventDefault();
        this.orderManpulator.onContextMenu(e);
      },
    };

    // Actions
    this.addStagePosition = this.addStagePosition.bind(this);
    this.addInstrument = this.addInstrument.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.onElementClick = this.onElementClick.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.cancelModal = this.cancelModal.bind(this);
    this.finishDelete = this.finishDelete.bind(this);
  }

  cancelModal(){
    this.setState({modal:-1});
  }

  finishDelete(){
    const ordering = this.state.ordering;
    ordering.delete(this.selectHandler.selectionIds[0]);
    this.setState({ordering});
    this.props.deleteElement(this.selectHandler.selectionIds[0]);
    this.cancelModal();
  }

  onDelete(){
    if(this.selectHandler.hasSelection()){
      this.setState({modal: modals.DELETE_ELEMENT});
    }
  }

  // eslint-disable-next-line react/sort-comp
  commitManipulation(id, geometry) {
    this.setState({ dirtyElements: this.state.dirtyElements.set(id, geometry) });
  }

  /**
   * Save geometry changes by invoking the 'saveGeometry' callback
   * property. Clears all changes from local state.
   */
  saveChanges() {
    if (this.state.dirtyElements.size > 0) {
      this.props.saveGeometry(this.state.dirtyElements);
    }
    if (this.state.changedOrder.size > 0){
      this.props.saveOrder(this.state.ordering);
    }

    // Clear dirty elements
    this.setState({ dirtyElements: new Map(), changedOrder: new List() });
  }

  /**
     * Changes the manipulation mode of the GeometryManipulator
     * @param {integer} newMode One of the ManipulateModes.
     */
  // eslint-disable-next-line react/sort-comp
  changeMode(newMode) {
    this.setState({ manipulationMode: newMode });
    this.geomManip.mode = newMode;
    this.selectHandler.mode = newMode;
  }

  addInstrument(formData) {
    const instrument = new Instrument(formData.name.value, -2, formData.instrument.value, Geometry.translation(20, 50));
    this.props.addElement(instrument);
  }

  addStagePosition(formData) {
    const name = formData.bandmemberName.value;
    const member = new StagePosition(name, Geometry.translation(20, 50));
    if (!(name in this.state.positions)) {
      const set = this.state.positions;
      set[name] = member;
      this.setState({ members: set });
    }
  }

  onElementClick(e, id, node) {
    if (this.selectHandler.setSelection(node, id, e)) {
      e.stopPropagation();
      this.setState({ selected: this.selectHandler.selected, selectedIds: this.selectHandler.selectionIds });
      return true;
    }
    return false;
  }

  renderModals(){
    const {modal} = this.state;
    const { elements } = this.props;

    if(modal === -1) return null;
    if(modal === modals.DELETE_ELEMENT){
      return (<Modal show={true}>
          <Modal.Header>Verwijder element</Modal.Header>
          <Modal.Body>
            <p>Weet je zeker dat je {elements.get(this.selectHandler.selectionIds[0]).name} wilt verwijderen?</p>
            <ButtonGroup>
              <Button bsStyle="primary" onClick={this.finishDelete}>Ja</Button>
              <Button bsStyle="danger" onClick={this.cancelModal}>Nee</Button>
            </ButtonGroup>
          </Modal.Body>
        </Modal>);
    }
    if(modal === modals.ADD_ROLE){
      return (
        <Modal show={true}>
          <Modal.Header>Voeg een rol toe</Modal.Header>
          <Modal.Body>
            
          </Modal.Body>
        </Modal>
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Assign ordering
    if (prevProps.ordering !== this.props.ordering) {
      this.setState({ordering: this.props.ordering});
    }
  }

  render() {
    const { positions, elements, roles } = this.props;
    const {
      selectedIds, selected, menu, dirtyElements, manipulationMode, changedOrder, modal
    } = this.state;
    return (
      <React.Fragment>
        <StageplanToolbar
          manipulationMode={manipulationMode}
          changeMode={this.changeMode}
          addPosition={this.addStagePosition}
          addElement={this.addInstrument}
          hasChange={dirtyElements.size > 0 || changedOrder.size > 0}
          onSave={this.saveChanges}
          onDelete={this.onDelete}
        />
        <div style={{ display: 'inlineBlock' }}>
          {selectedIds.length > 0 ? (
            <span style={{ fontWeight: 'bold' }}>
              {`Geselecteerd: ID: ${selectedIds[0]}`}
            </span>
          ) : null
          }
        </div>
        <div tabIndex="0" role="presentation" {...this.handlers}>
          <SvgContext.Provider value={this}>
            <StageplanCanvas
              width="100%"
              height="480"
              svgRef={this.svg}
              selected={selected}
              positions={positions}
              elements={elements}
              locations={dirtyElements}
              onElementClick={this.onElementClick}
              drawOrder={this.state.ordering.indToId}
            >
              {menu ? (<SvgMenu name={menu.name} pos={menu.pos} items={menu.items} padding={5} />) : null}
            </StageplanCanvas>
          </SvgContext.Provider>
        </div>
        {this.renderModals()}
      </React.Fragment>
    );
  }
}

StageplanViewer.propTypes = {
  stageplanId: PropTypes.number.isRequired,
  addElement: PropTypes.func.isRequired,
  elements: PropTypes.instanceOf(Map).isRequired,
  positions: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  saveGeometry: PropTypes.func.isRequired,
};

export default StageplanViewer;
