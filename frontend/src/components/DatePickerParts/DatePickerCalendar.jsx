import React, { Component } from "react";

import PropTypes from 'prop-types';
import {daysInMonth, atNoon, getWeekNumber, getDaysInMonth} from '@Utils/DateTimeUtils.js';

export default class DatePickerCalendar extends Component{
  handleClick(day) {
    const newSelectedDate = atNoon(new Date(this.props.displayDate));
    newSelectedDate.setDate(day);
    this.props.onChange(newSelectedDate);
  }

  handleClickToday() {
    const newSelectedDate = atNoon(new Date());
    this.props.onChange(newSelectedDate);
  }

  render() {
    const currentDate = atNoon(new Date());
    const selectedDate = this.props.selectedDate ? atNoon(new Date(this.props.selectedDate)) : null;
    const minDate = this.props.minDate ? atNoon(new Date(this.props.minDate)) : null;
    const maxDate = this.props.maxDate ? atNoon(new Date(this.props.maxDate)) : null;
    const year = this.props.displayDate.getFullYear();
    const month = this.props.displayDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startingDay = this.props.weekStartsOn > 1
      ? firstDay.getDay() - this.props.weekStartsOn + 7
      : this.props.weekStartsOn === 1
        ? (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1)
        : firstDay.getDay();
    const showWeeks = this.props.showWeeks;

    let monthLength = getDaysInMonth(month, year);

    const weeks = [];
    let day = 1;
    for (let i = 0; i < 9; i++) {
      const week = [];
      for (let j = 0; j <= 6; j++) {
        if (day <= monthLength && (i > 0 || j >= startingDay)) {
          let className = null;
          const date = new Date(year, month, day, 12, 0, 0, 0).toISOString();
          const beforeMinDate = minDate && Date.parse(date) < Date.parse(minDate);
          const afterMinDate = maxDate && Date.parse(date) > Date.parse(maxDate);
          if (beforeMinDate || afterMinDate) {
            week.push(<td
              key={j}
              style={{ padding: this.props.cellPadding }}
              className="text-muted"
            >
              {day}
            </td>);
          } else if (Date.parse(date) === Date.parse(selectedDate)) {
            className = 'bg-primary';
          } else if (Date.parse(date) === Date.parse(currentDate)) {
            className = 'text-primary';
          }
          week.push(<td
            key={j}
            onClick={this.handleClick.bind(this, day)}
            style={{ cursor: 'pointer', padding: this.props.cellPadding, borderRadius: this.props.roundedCorners ? 5 : 0 }}
            className={className}
          >
            {day}
          </td>);
          day++;
        } else {
          week.push(<td key={j} />);
        }
      }


      if (showWeeks){
        const weekNum = getWeekNumber(new Date(year, month,  day - 1, 12, 0, 0, 0));
        week.unshift(<td
            key={7}
            style={{padding: this.props.cellPadding, fontSize: '0.8em', color: 'darkgrey'}}
            className="text-muted"
        >
          {weekNum}
        </td>);

      }

      weeks.push(<tr key={i}>{week}</tr>);
      if (day > monthLength) {
        break;
      }
    }

    const weekColumn = showWeeks ?
        <td
        className="text-muted current-week"
        style={{padding: this.props.cellPadding}} /> :
        null;

    return <table className="text-center">
      <thead>
        <tr>
          {weekColumn}
          {this.props.dayLabels.map((label, index)=>{
            return <td
              key={index}
              className="text-muted"
              style={{padding: this.props.cellPadding}}>
              <small>{label}</small>
            </td>;
          })}
        </tr>
      </thead>
      <tbody>
        {weeks}
      </tbody>
      {this.props.showTodayButton && <tfoot>
        <tr>
          <td colSpan={this.props.dayLabels.length} style={{ paddingTop: '9px' }}>
            <Button
              block
              bsSize="xsmall"
              className="u-today-button"
              onClick={this.handleClickToday}>
              {this.props.todayButtonLabel}
            </Button>
          </td>
        </tr>
      </tfoot>}
    </table>;
  }
};

DatePickerCalendar.propTypes = {
    selectedDate: PropTypes.object,
    displayDate: PropTypes.object.isRequired,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    dayLabels: PropTypes.array.isRequired,
    cellPadding: PropTypes.string.isRequired,
    weekStartsOn: PropTypes.number,
    showTodayButton: PropTypes.bool,
    todayButtonLabel: PropTypes.string,
    roundedCorners: PropTypes.bool,
    showWeeks: PropTypes.bool
  };