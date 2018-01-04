import React from "react";
import {connect} from "react-redux";
import {fetchMethods} from "./../../method/method-action";
import {
    methodListSelector,
    methodDetailSelector
} from "./../../method/method-reducer";
import {selectedMethodsSelector} from "./execution-create-reducer";
import {
    initialize,
    toggleMethodSelection,
    fetchSelectedMethods,
    destroy
} from "./execution-create-action";
import {push} from "react-router-redux";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {SelectMethods} from "./select-methods";
import {SelectFiles} from "./select-files";
import {Container} from "reactstrap";
import {SelectMetadata} from "./select-metadata";

class ExecutionCreateContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.onSetMetadata = this.onSetMetadata.bind(this);
        this.onMethodsSelected = this.onMethodsSelected.bind(this);
        this.onFilesSelected = this.onFilesSelected.bind(this);
        this.createExecution = this.createExecution.bind(this);
        this.selectActiveComponent = this.selectActiveComponent.bind(this);
    }

    getInitialState() {
        return {
            "step": 0
        }
    }

    componentDidMount() {
        this.props.initialize();
    }

    render() {
        return (
            <Container fluid={false}>
                {this.selectActiveComponent()}
            </Container>
        )
    }

    selectActiveComponent() {
        switch (this.state.step) {
            case 0:
                return (
                    <SelectMetadata onSetMetadata={this.onSetMetadata}/>
                );
            case 1:
                return (
                    <SelectMethods
                        isLoading={isLoadingSelector(this.props.methodsList)}
                        methods={dataSelector(this.props.methodsList)}
                        selected={this.props.selected}
                        onToggleSelection={this.props.toggleMethodSelection}
                        onSelect={this.onMethodsSelected}
                    />
                );
            case 2:
                return (
                    <SelectFiles
                        methods={this.props.methods}
                        onFilesSelected={this.onFilesSelected}
                    />
                );
            default:
                return (
                    <div>
                        Unexpected state : {this.state.step}
                    </div>
                )
        }
    }

    onSetMetadata(execution) {
        this.setState({
            "step": 1,
            "execution": execution
        });
    }

    onMethodsSelected() {
        this.props.fetchSelected(Object.keys(this.props.selected));
        this.setState({
            "step": 2
        });
    }

    onFilesSelected(files) {
        this.createExecution(files);
    }

    createExecution(files) {
        const formData = new FormData();

        const usedMethodsIds = Object.keys(this.props.selected);
        formData.append("methods", JSON.stringify(usedMethodsIds));
        formData.append("execution", JSON.stringify(this.state.execution));

        for (let key in files) {
            const item = files[key];
            formData.append("input", item.file, item.fileName);
        }

        // TODO Add sending wait-dialog.

        fetch("/api/v1/resources/executions", {
            "method": "POST",
            "body": formData
        }).then(() => {
            // TODO Use better implementation, ie. move to API - action ?
            this.props.navigateToExecutionList();
        });
    }

}

export const ExecutionCreate = connect(
    (state, ownProps) => {
        const selected = selectedMethodsSelector(state);
        const methods = Object.keys(selected)
        .map((key) => methodDetailSelector(state, key));
        return {
            "methodsList": methodListSelector(state),
            "methods": methods,
            "selected": selected
        };
    },
    (dispatch, ownProps) => ({
        "initialize": () => {
            dispatch(initialize());
            dispatch(fetchMethods());
        },
        "destroy": () => {
            dispatch(destroy());
        },
        "navigateToExecutionList": () => {
            dispatch(push("/execution"))
        },
        "toggleMethodSelection": (methodId) => {
            dispatch(toggleMethodSelection(methodId))
        },
        "fetchSelected": (methods) => {
            dispatch(fetchSelectedMethods(methods));
        }
    })
)(ExecutionCreateContainer);
