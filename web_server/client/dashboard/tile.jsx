import React from "react";
import {PropTypes} from "prop-types";


export class Tile extends React.Component {

    render() {
        const {method, data} = this.props;
        if (method === undefined) {
            return (
                <div>Loading ...</div>
            )
        }

        if (data === undefined) {
            return (
                <div>Loading ({method.metadata.label}) ...</div>
            )
        }
        const Component = this.props.component;
        const label = method.metadata.label;
        return (
            <div>
                <p>
                    <b>{label}</b>
                </p>
                <Component
                    data={this.props.filteredData}
                    unfilteredData={this.props.data}
                    selected={this.props.selection}
                    changeSelection={this.props.changeSelection}/>
            </div>
        )
    }

}