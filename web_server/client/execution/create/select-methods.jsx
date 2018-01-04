import React from "react";
import {addLoadingIndicator} from "./../../components/loading-indicator";
import {Input} from "reactstrap";

class SelectMethodsComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {methods, selected, onToggleSelection, onSelect} = this.props;
        return (
            <div>
                <b>Select methods: </b><br/>
                {methods.map((method) => (
                        <div key={method.id}>
                            <Input type="checkbox"
                                   onChange={() => onToggleSelection(method.id)}
                                   checked={selected[method.id] === true}
                            />
                            {method.label}
                        </div>
                    )
                )}
                <br/>
                <button onClick={onSelect}>Select and next</button>
            </div>
        )
    }

}

export const SelectMethods = addLoadingIndicator(SelectMethodsComponent);
