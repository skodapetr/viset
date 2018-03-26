import React from "react";
import {connect} from "react-redux";
import {LoadingIndicator} from "./../../components/loading-indicator";
import {Button, FormGroup, Label, Input} from "reactstrap";
import {methodListSelector} from "./../../method/method-reducer";
import {fetchMethods} from "./../../method/method-action";
import {isLoadingSelector, dataSelector} from "./../../service/repository";

class WizardMethodsComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onToggleSelection = this.onToggleSelection.bind(this);
        this.canSubmit = this.canSubmit.bind(this);
    }

    getInitialState() {
        return {};
    }

    componentDidMount() {
        this.props.initialize();
    }

    render() {
        if (this.props.isLoading) {
            return (
                <LoadingIndicator/>
            );
        }
        const {methods} = this.props;
        return (
            <FormGroup>
                <Label>Methods</Label>
                {methods.map((method) => (
                        <FormGroup key={method.id} check>
                            <Label check>
                                <Input type="checkbox"
                                       onChange={() => this.onToggleSelection(method.id)}
                                       checked={this.state[method.id] === true}/>
                                {" "}{method.label}
                            </Label>
                        </FormGroup>
                    )
                )}
                <br/>
                <Button onClick={this.onSubmitForm}
                        disabled={!this.canSubmit()}>Next</Button>
            </FormGroup>
        )
    }

    onToggleSelection(id) {
        const value = !(this.state[id]);
        this.setState({[id]: value});
    }

    onSubmitForm() {
        const output = {};
        this.props.methods.map((method) => {
            output[method.id] = this.state[method.id] === true;
        });
        this.props.onSubmit(output);
    }

    canSubmit() {
        for (let index in this.state) {
            if (this.state[index]) {
                return true;
            }
        }
        return false;
    }

}

export const WizardMethods = connect(
    (state, ownProps) => {
        const methods = methodListSelector(state);
        return {
            "isLoading": isLoadingSelector(methods),
            "methods": dataSelector(methods)
        };
    },
    (dispatch, ownProps) => ({
        "initialize": () => {
            dispatch(fetchMethods());
        },
    })
)(WizardMethodsComponent);
