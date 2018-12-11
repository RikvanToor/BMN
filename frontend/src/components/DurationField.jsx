import React, {Component} from 'react';
import FormattedTextField, {timeFormat} from '@Components/FormattedTextField.jsx';

export default class DurationField extends Component{
    render(){
        let valueConverter = (parts, toFormatted) =>{
            if(toFormatted) return parts[0] + ':' + parts[1];
            else return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        };
        return (
            <FormattedTextField format={timeFormat} valueConverter={valueConverter} {...this.props}/>
        );
    }
}