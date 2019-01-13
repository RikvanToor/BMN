import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  Tooltip, OverlayTrigger, ToggleButton, Popover, ButtonToolbar, Button, ButtonGroup, ToggleButtonGroup,
} from 'react-bootstrap';
import Form, { FormField, SubmitButton } from '@Components/Form.jsx';

// Icons
import RotateIcon from './Assets/Icons/rotate.svg';
import SelectIcon from './Assets/Icons/select.svg';
import ScaleIcon from './Assets/Icons/scale.svg';
import TranslateIcon from './Assets/Icons/translate.svg';
import CrosshairIcon from './Assets/Icons/crosshair.svg';
import TrashIcon from './Assets/Icons/trash.svg';

import ManipulateModes from './Manipulation/ManipulateModes';

import { elementTypes } from './ImportableElements';

/**
   * Available tools for manipulating stage elements
   */
const tools = [
  { value: ManipulateModes.SELECT, tooltip: 'Selecteer een object. Sneltoets: \'q\'', comp: SelectIcon },
  { value: ManipulateModes.TRANSLATE, tooltip: 'Verplaats een object. Sneltoets: \'t\'', comp: TranslateIcon },
  { value: ManipulateModes.ROTATE, tooltip: 'Roteer een object. Sneltoets: \'r\'', comp: RotateIcon },
  { value: ManipulateModes.SCALE, tooltip: 'Schaal een object. Sneltoets: \'s\'', comp: ScaleIcon },
  { value: 5, tooltip: 'Plaats marker. Sneltoets: \'p\'', comp: CrosshairIcon }, // TODO
];

class ToggleButtonWithTooltip extends PureComponent {
  render() {
    const { tooltip, children, ...props } = this.props;
    const tooltipEl = (
      <Tooltip id="tooltip_bt">
        {tooltip}
      </Tooltip>
    );
    return (
      <OverlayTrigger placement="top" overlay={tooltipEl}>
        <ToggleButton {...props}>{children}</ToggleButton>
      </OverlayTrigger>
    );
  }
}


// eslint-disable-next-line react/no-multi-comp
class StageplanToolbar extends PureComponent {
  render() {
    const {
      addPosition, addElement, manipulationMode, changeMode, onSave, hasChange, onDelete,
    } = this.props;
    const elementOpts = Object.keys(elementTypes).map(el => ({ name: elementTypes[el], value: el }));

    const addBandMemberForm = (
      <Popover id="addPositionPopover">
        <Form onSubmit={addPosition}>
          <FormField label="Positie naam" id="positionName" />
          <SubmitButton>Voeg toe</SubmitButton>
        </Form>
      </Popover>
    );
    const addInstrumentForm = (
      <Popover id="addElementPopover">
        <Form onSubmit={addElement}>
          <FormField label="Naam" id="name" type="text" />
          <FormField label="Element" id="instrument" type="select" options={elementOpts} />
          <SubmitButton>Voeg element toe</SubmitButton>
        </Form>
      </Popover>
    );

    return (
      <React.Fragment>
        <ButtonToolbar style={{ marginBottom: '10px' }}>
          <ButtonGroup>
            <OverlayTrigger trigger="click" placement="bottom" rootClose overlay={addBandMemberForm}>
              <Button>Voeg bandlid toe</Button>
            </OverlayTrigger>
            <OverlayTrigger trigger="click" placement="bottom" rootClose overlay={addInstrumentForm}>
              <Button>Voeg instrument toe</Button>
            </OverlayTrigger>
          </ButtonGroup>
          <ToggleButtonGroup type="radio" name="mode" value={manipulationMode} onChange={changeMode}>
            {tools.map((el) => {
              const Comp = el.comp;
              const { comp, ...props } = el;
              return (
                <ToggleButtonWithTooltip bsSize="small" key={el.value} {...props}><Comp width="20" height="20" /></ToggleButtonWithTooltip>
              );
            })}
          </ToggleButtonGroup>
          <ButtonGroup>
            <Button onClick={onDelete} bsSize="small" bsStyle="danger"><TrashIcon width="20" height="20" /></Button>
          </ButtonGroup>
          <ButtonGroup>
            {hasChange
              ? (<Button bsStyle="primary" onClick={onSave}>Opslaan</Button>)
              : (<Button bsStyle="primary" disabled>Opgeslagen</Button>)
            }
          </ButtonGroup>
        </ButtonToolbar>
      </React.Fragment>
    );
  }
}
StageplanToolbar.propTypes = {
  manipulationMode: PropTypes.oneOf(Object.values(ManipulateModes)).isRequired,
  changeMode: PropTypes.func.isRequired,
  addPosition: PropTypes.func.isRequired,
  addElement: PropTypes.func.isRequired,
  hasChange: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default StageplanToolbar;
