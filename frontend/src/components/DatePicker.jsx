import DatePickerHeader from '@Components/DatePickerParts/DatePickerHeader.jsx';
import DatePickerCalendar from '@Components/DatePickerParts/DatePickerCalendar.jsx';
import React, { Component } from "react";
import {daysInMonth, atNoon, getWeekNumber, dateOnlyFromISO} from '@Utils/DateTimeUtils.js';
import {InputGroup, Overlay, FormControl, Popover} from 'react-bootstrap';

import PropTypes from 'prop-types';

const language = typeof window !== 'undefined' && window.navigator ? (window.navigator.userLanguage || window.navigator.language || '').toLowerCase() : '';

//Port of react-bootstrap-date-picker with modern React

export default class DatePicker extends Component{
  constructor(props){
    super(props);
    
    //References to DOM nodes
    this.hiddenInput = React.createRef();
    this.overlayContainer = React.createRef();
    
    //Check conflicting properties
    if (this.props.value && this.props.defaultValue) {
      throw new Error('Conflicting DatePicker properties \'value\' and \'defaultValue\'');
    }
    const state = this.makeDateValues(this.props.value || this.props.defaultValue);
    if (this.props.weekStartsOn > 1) {
      state.dayLabels = this.props.dayLabels
        .slice(this.props.weekStartsOn)
        .concat(this.props.dayLabels.slice(0, this.props.weekStartsOn));
    } else if (this.props.weekStartsOn === 1) {
      state.dayLabels = this.props.dayLabels.slice(1).concat(this.props.dayLabels.slice(0,1));
    } else {
      state.dayLabels = this.props.dayLabels;
    }
    state.focused = false;
    state.inputFocused = false;
    state.placeholder = this.props.placeholder || this.props.dateFormat;
    state.separator = this.props.dateFormat.match(/[^A-Z]/)[0];
    this.state = state;
  }

  makeDateValues(isoString) {
    let displayDate;
    const selectedDate = isoString ? dateOnlyFromISO(isoString): null;
    const minDate = this.props.minDate ? dateOnlyFromISO(isoString) : null;
    const maxDate = this.props.maxDate ? dateOnlyFromISO(isoString) : null;

    const inputValue = isoString ? this.makeInputValueString(selectedDate) : null;
    if (selectedDate) {
      displayDate = new Date(selectedDate);
    } else {
      const today = new Date(`${(new Date().toISOString().slice(0,10))}T12:00:00.000Z`);
      if (minDate && Date.parse(minDate) >= Date.parse(today)){
        displayDate = minDate;
      } else if (maxDate && Date.parse(maxDate) <= Date.parse(today)){
        displayDate = maxDate;
      } else {
        displayDate = today;
      }
    }

    return {
      value: selectedDate ? selectedDate.toISOString() : null,
      displayDate: displayDate,
      selectedDate: selectedDate,
      inputValue: inputValue
    };
  }

  clear() {
    if (this.props.onClear) {
      this.props.onClear();
    }
    else {
      this.setState(this.makeDateValues(null));
    }

    if (this.props.onChange) {
      this.props.onChange(null, null);
    }
  }

  handleHide() {
    if (this.state.inputFocused) {
      return;
    }
    this.setState({
      focused: false
    });
    if (this.props.onBlur) {
      const event = document.createEvent('CustomEvent');
      event.initEvent('Change Date', true, false);
      this.hiddenInput.dispatchEvent(event);
      this.props.onBlur(event);
    }
  }

  handleKeyDown(e) {
    if (e.which === 9 && this.state.inputFocused) {
      this.setState({
        focused: false
      });

      if (this.props.onBlur) {
        const event = document.createEvent('CustomEvent');
        event.initEvent('Change Date', true, false);
        this.hiddenInput.dispatchEvent(event);
        this.props.onBlur(event);
      }
    }
  }

  handleFocus() {
    if (this.state.focused === true) {
      return;
    }

    const placement = this.getCalendarPlacement();

    this.setState({
      inputFocused: true,
      focused: true,
      calendarPlacement: placement
    });

    if (this.props.onFocus) {
      const event = document.createEvent('CustomEvent');
      event.initEvent('Change Date', true, false);
      this.hiddenInput.dispatchEvent(event);
      this.props.onFocus(event);
    }
  }

  handleBlur() {
    this.setState({
      inputFocused: false
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(this.state.inputFocused === true && nextState.inputFocused === false);
  }

  getValue() {
    return this.state.selectedDate ? this.state.selectedDate.toISOString() : null;
  }

  getFormattedValue() {
    return this.state.displayDate ? this.state.inputValue : null;
  }

  getCalendarPlacement() {
    const tag = Object.prototype.toString.call(this.props.calendarPlacement);
    const isFunction = tag === '[object AsyncFunction]' || tag === '[object Function]' || tag === '[object GeneratorFunction]' || tag === '[object Proxy]';
    if (isFunction) {
      return this.props.calendarPlacement();
    }
    else {
      return this.props.calendarPlacement;
    }
  }

  makeInputValueString(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    //this method is executed during intialState setup... handle a missing state properly
    const separator = (this.state ? this.state.separator : this.props.dateFormat.match(/[^A-Z]/)[0]);
    if (this.props.dateFormat.match(/MM.DD.YYYY/)) {
      return (month > 9 ? month : `0${month}`) + separator + (day > 9 ? day : `0${day}`) + separator + date.getFullYear();
    }
    else if (this.props.dateFormat.match(/DD.MM.YYYY/)) {
      return (day > 9 ? day : `0${day}`) + separator + (month > 9 ? month : `0${month}`) + separator + date.getFullYear();
    }
    else {
      return date.getFullYear() + separator + (month > 9 ? month : `0${month}`) + separator + (day > 9 ? day : `0${day}`);
    }
  }

  handleBadInput(originalValue) {
    const parts = originalValue.replace(new RegExp(`[^0-9${this.state.separator}]`), '').split(this.state.separator);
    if (this.props.dateFormat.match(/MM.DD.YYYY/) || this.props.dateFormat.match(/DD.MM.YYYY/)) {
      if (parts[0] && parts[0].length > 2) {
        parts[1] = parts[0].slice(2) + (parts[1] || '');
        parts[0] = parts[0].slice(0, 2);
      }
      if (parts[1] && parts[1].length > 2) {
        parts[2] = parts[1].slice(2) + (parts[2] || '');
        parts[1] = parts[1].slice(0, 2);
      }
      if (parts[2]) {
        parts[2] = parts[2].slice(0,4);
      }
    } else {
      if (parts[0] && parts[0].length > 4) {
        parts[1] = parts[0].slice(4) + (parts[1] || '');
        parts[0] = parts[0].slice(0, 4);
      }
      if (parts[1] && parts[1].length > 2) {
        parts[2] = parts[1].slice(2) + (parts[2] || '');
        parts[1] = parts[1].slice(0, 2);
      }
      if (parts[2]) {
        parts[2] = parts[2].slice(0,2);
      }
    }
    this.setState({
      inputValue: parts.join(this.state.separator)
    });
  }

  handleInputChange() {

    const originalValue = ReactDOM.findDOMNode(this.refs.input).value;
    const inputValue = originalValue.replace(/(-|\/\/)/g, this.state.separator).slice(0,10);

    if (!inputValue) {
      this.clear();
      return;
    }

    let month, day, year;
    if (this.props.dateFormat.match(/MM.DD.YYYY/)) {
      if (!inputValue.match(/[0-1][0-9].[0-3][0-9].[1-2][0-9][0-9][0-9]/)) {
        return this.handleBadInput(originalValue);
      }

      month = inputValue.slice(0,2).replace(/[^0-9]/g, '');
      day = inputValue.slice(3,5).replace(/[^0-9]/g, '');
      year = inputValue.slice(6,10).replace(/[^0-9]/g, '');
    } else if (this.props.dateFormat.match(/DD.MM.YYYY/)) {
      if (!inputValue.match(/[0-3][0-9].[0-1][0-9].[1-2][0-9][0-9][0-9]/)) {
        return this.handleBadInput(originalValue);
      }

      day = inputValue.slice(0,2).replace(/[^0-9]/g, '');
      month = inputValue.slice(3,5).replace(/[^0-9]/g, '');
      year = inputValue.slice(6,10).replace(/[^0-9]/g, '');
    } else {
      if (!inputValue.match(/[1-2][0-9][0-9][0-9].[0-1][0-9].[0-3][0-9]/)) {
        return this.handleBadInput(originalValue);
      }

      year = inputValue.slice(0,4).replace(/[^0-9]/g, '');
      month = inputValue.slice(5,7).replace(/[^0-9]/g, '');
      day = inputValue.slice(8,10).replace(/[^0-9]/g, '');
    }

    const monthInteger = parseInt(month, 10);
    const dayInteger = parseInt(day, 10);
    const yearInteger = parseInt(year, 10);
    if (monthInteger > 12 || dayInteger > 31) {
      return this.handleBadInput(originalValue);
    }

    if (!isNaN(monthInteger) && !isNaN(dayInteger) && !isNaN(yearInteger) && monthInteger <= 12 && dayInteger <= 31 && yearInteger > 999) {
      const selectedDate = new Date(yearInteger, monthInteger - 1, dayInteger, 12, 0, 0, 0);
      this.setState({
        selectedDate: selectedDate,
        displayDate: selectedDate,
        value: selectedDate.toISOString()
      });

      if (this.props.onChange) {
        this.props.onChange(selectedDate.toISOString(), inputValue);
      }
    }

    this.setState({
      inputValue: inputValue
    });
  }

  onChangeMonth(newDisplayDate) {
    this.setState({
      displayDate: newDisplayDate
    });
  }

  onChangeDate(newSelectedDate) {
    const inputValue = this.makeInputValueString(newSelectedDate);
    this.setState({
      inputValue: inputValue,
      selectedDate: newSelectedDate,
      displayDate: newSelectedDate,
      value: newSelectedDate.toISOString(),
      focused: false
    });

    if (this.props.onBlur) {
      const event = document.createEvent('CustomEvent');
      event.initEvent('Change Date', true, false);
      this.hiddenInput.dispatchEvent(event);
      this.props.onBlur(event);
    }

    if (this.props.onChange) {
      this.props.onChange(newSelectedDate.toISOString(), inputValue);
    }
  }

  componentWillReceiveProps(newProps) {
    const value = newProps.value;
    if (this.getValue() !== value) {
      this.setState(this.makeDateValues(value));
    }
  }
  bound(func){
    return func.bind(this);
  }

  render() {
    let bound = this.bound.bind(this);
    const calendarHeader = (<DatePickerHeader
      previousButtonElement={this.props.previousButtonElement}
      nextButtonElement={this.props.nextButtonElement}
      displayDate={this.state.displayDate}
      minDate={this.props.minDate}
      maxDate={this.props.maxDate}
      onChange={bound(this.onChangeMonth)}
      monthLabels={this.props.monthLabels}
      dateFormat={this.props.dateFormat} />);
      
      let controlProps = {
        value: this.state.inputValue || '',
        required: this.props.required,
        placeholder: this.state.focused ? this.props.dateFormat : this.state.placeholder,
        ref: this.hiddenInput,
        disabled: this.props.disabled,
        onKeyDown: bound(this.handleKeyDown),
        onFocus: bound(this.handleFocus),
        onBlur: bound(this.handleBlur),
        onChange: bound(this.handleInputChange),
        onInvalid: this.props.onInvalid,
        className: this.props.className,
        style: this.props.style,
        autoComplete: this.props.autoComplete,
        noValidate: this.props.noValidate,
      };

    const control = this.props.customControl
      ? React.cloneElement(this.props.customControl, controlProps)
      : (<FormControl
          type="text" autoFocus={this.props.autoFocus} {...controlProps}
          />);

    return <InputGroup
      bsClass={this.props.showClearButton ? this.props.bsClass : ''}
      bsSize={this.props.bsSize}
      id={this.props.id ? `${this.props.id}_group` : null}>
      {control}
      <Overlay
        rootClose={true}
        onHide={bound(this.handleHide)}
        show={this.state.focused}
        container={() => this.props.calendarContainer || this.overlayContainer}
        target={() => this.hiddenInput}
        placement={this.state.calendarPlacement}
        delayHide={200}>
        <Popover id={`date-picker-popover-${this.props.instanceCount}`} className="date-picker-popover" title={calendarHeader}>
          <DatePickerCalendar
            cellPadding={this.props.cellPadding}
            selectedDate={this.state.selectedDate}
            displayDate={this.state.displayDate}
            onChange={bound(this.onChangeDate)}
            dayLabels={this.state.dayLabels}
            weekStartsOn={this.props.weekStartsOn}
            showTodayButton={this.props.showTodayButton}
            todayButtonLabel={this.props.todayButtonLabel}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            roundedCorners={this.props.roundedCorners}
            showWeeks={this.props.showWeeks}
           />
        </Popover>
      </Overlay>
      <div ref={this.overlayContainer} style={{position: 'relative'}} />
      <input ref={this.hiddenInput} type="hidden" id={this.props.id} name={this.props.name} value={this.state.value || ''} data-formattedvalue={this.state.value ? this.state.inputValue : ''} />
      {this.props.showClearButton && !this.props.customControl && <InputGroup.Addon
        onClick={this.props.disabled ? null : this.clear}
        style={{cursor:(this.state.inputValue && !this.props.disabled) ? 'pointer' : 'not-allowed'}}>
        <div style={{opacity: (this.state.inputValue && !this.props.disabled) ? 1 : 0.5}}>
          {this.props.clearButtonElement}
        </div>
      </InputGroup.Addon>}
      {this.props.children}
    </InputGroup>;
  }
};

DatePicker.propTypes = {
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  cellPadding: PropTypes.string,
  autoComplete: PropTypes.string,
  placeholder: PropTypes.string,
  dayLabels: PropTypes.array,
  monthLabels: PropTypes.array,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  weekStartsOnMonday: (props, propName, componentName) => {
    if (props[propName]) {
      return new Error(`Prop '${propName}' supplied to '${componentName}' is obsolete. Use 'weekStartsOn' instead.`);
    }
  },
  weekStartsOn: PropTypes.number,
  clearButtonElement: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  showClearButton: PropTypes.bool,
  previousButtonElement: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  nextButtonElement: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  calendarPlacement: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  dateFormat: PropTypes.string, // 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD', 'DD-MM-YYYY'
  bsClass: PropTypes.string,
  bsSize: PropTypes.string,
  calendarContainer: PropTypes.object,
  id: PropTypes.string,
  name: PropTypes.string,
  showTodayButton: PropTypes.bool,
  todayButtonLabel: PropTypes.string,
  instanceCount: PropTypes.number,
  customControl: PropTypes.object,
  roundedCorners: PropTypes.bool,
  showWeeks: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node

  ]),
  onInvalid: PropTypes.func,
  noValidate: PropTypes.bool
};

DatePicker.defaultProps = {
    cellPadding: '5px',
    dayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthLabels: ['January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December'],
    clearButtonElement: '×',
    previousButtonElement: '<',
    nextButtonElement: '>',
    calendarPlacement: 'bottom',
    dateFormat: !language || language === 'en-us' ? 'MM/DD/YYYY' : 'DD/MM/YYYY',
    showClearButton: true,
    autoFocus: false,
    disabled: false,
    showTodayButton: false,
    todayButtonLabel: 'Today',
    autoComplete: 'on',
    showWeeks: false,
    instanceCount: 1,
    style: {
      width: '100%'
    },
    roundedCorners: false,
    noValidate: false
  };