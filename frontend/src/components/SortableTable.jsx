import React, {Component} from 'react';
import {Table, Glyphicon} from 'react-bootstrap';
import PropTypes from 'prop-types';
import * as TypeChecks from '@Utils/TypeChecks.js';
import {intRange} from '@Utils/Ranges.js';

const SortModes = {
    ASC: 0,
    DESC: 1
};

export default class SortableTable extends Component{
    constructor(props){
        super(props);

        this.state = {
            sortColumn: -1,
            sortMode: SortModes.ASC
        };
    }
    toggleSort(i){
        if(this.state.sortColumn != i){
            this.setState({
                sortColumn: i,
                sortMode: SortModes.ASC
            });
        }
        else{
            //Flip between ASC/DESC
            this.setState({
                sortMode: 1 - this.state.sortMode
            });
        }
    }
    sort(data,sorters, order){
        //ASC: 1, DESC: -1. Used in the sorting
        let mod = 1 - 2 * this.state.sortMode;
        
        let col = this.state.sortColumn;
        if(TypeChecks.isString(sorters[col])){
            let key = sorters[col];
            //Assume simple comparability
            order.sort((a,b)=>{
                const aVal = data[a][key];
                const bVal = data[b][key];
                if(aVal < bVal){
                    return -mod;
                }
                else if(aVal > bVal){
                    return mod;
                }
                return 0;
            });
        }
        //Sorter function should always return ASC!
        else if(TypeChecks.isFunction(sorters[col])){
            order.sort((a,b)=>{
                let val = sorters[col](data[a], data[b]);
                if(val < 0) return -mod;
                if(val > 0) return mod;
                return 0;
            });
        }
        return order;
    }
    render(){
        let {sorters, data, icons, headers, filter, ...props} = this.props;
        //Get children as array.
        let children = React.Children.toArray(this.props.children);
        let order = intRange(0, children.length);

        //Filter data if applicable
        if(filter){
            order = order.filter((i)=>filter(data[i]));
        }
        if(this.state.sortColumn != -1){
            order = this.sort(data, sorters, order);
        }

        return(
            <Table {...props}>
                <thead>
                    <tr>
                    {headers.map((el,i)=>{
                        if(!this.props.sorters[i]){
                          return (<th key={el}>{el}</th>);
                        }
                        let glyph = icons.neutral;
                        if(this.state.sortColumn == i){
                            glyph = this.state.sortMode == SortModes.ASC ? icons.ascending: icons.descending;
                        }
                        return (
                        <th className="sortable" key={el} data-ind={i} onClick={()=>this.toggleSort(i)}>
                        {el} {glyph ? (<Glyphicon glyph={glyph}/>) : null}
                        </th>
                        );
                        }
                    )}
                    </tr>
                </thead>
                <tbody>
                    {order.map((ind)=>children[ind])}
                </tbody>
            </Table>
        );
    }
}

SortableTable.propTypes = {
    //Object with column number as key and either a string for sorting (data under key assumed to be comparable) or
    //a compare function that, for arguments (a,b) returns whether a is smaller, equal or greater than b. (see compare function for Array.prototype.sort()).
    sorters: PropTypes.object.isRequired,
    //The data to use for sorting
    data: PropTypes.array.isRequired,
    //Headers to use in the table
    headers: PropTypes.array.isRequired,
    //Filter function
    filter: PropTypes.func
    //Children: rendered children, should be <tr> elements with proper amount of <td> cells
};

SortableTable.defaultProps = {
    //Glyphicon icons to use for a sortable column
    icons : {
        ascending: 'chevron-down', //Data is ascending, so ''lowest'' value is at top
        descending: 'chevron-up',
        neutral: 'stop'
    }
};