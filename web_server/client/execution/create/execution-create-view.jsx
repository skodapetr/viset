import React from "react";
import {connect} from "react-redux";
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
import {WizardGeneral} from "./wizard-general";
import {WizardFiles} from "./wizard-files";
import {Container} from "reactstrap";
import {WizardMethods} from "./wizard-methods";
import {WizardBenchmark} from "./wizard-benchmark";

class ExecutionCreateContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.onSetGeneral = this.onSetGeneral.bind(this);
        this.onSetMethods = this.onSetMethods.bind(this);
        this.onSetFiles = this.onSetFiles.bind(this);
        this.onSetBenchmark = this.onSetBenchmark.bind(this);
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
                    <WizardGeneral onSubmit={this.onSetGeneral}/>
                );
            case 1:
                return (
                    <WizardMethods onSubmit={this.onSetMethods}/>
                );
            case 2:
                return (
                    <WizardBenchmark onSubmit={this.onSetBenchmark}/>
                );
            case 3:
                // TODO Pass also "type".
                return (
                    <WizardFiles onSubmit={this.onSetFiles}
                                 methodsId={this.state.selectedMethods}
                                 executionType={this.state.type}/>
                );
            default:
                return (
                    <div>
                        Unexpected state : {this.state.step}
                    </div>
                )
        }
    }

    onSetGeneral(data) {
        this.setState({
            "step": 1,
            "label": data["label"],
            "description": data["description"],
            "type": data["type"]
        });
    }

    onSetMethods(methods) {
        const selectedMethods = [];
        for (let key in methods) {
            if (methods[key]) {
                selectedMethods.push(key);
            }
        }
        let nextStep = this.state.type === "benchmark" ? 2 : 3;
        this.setState({
            "step": nextStep,
            "selectedMethods": selectedMethods
        });
    }

    onSetBenchmark(data) {
        this.setState({
            "step": 3,
            "benchmark": data
        });
    }

    onSetFiles(files) {
        const data = {
            "execution": {
                "type": this.state.type,
                "label": this.state.label,
                "description": this.state.description,
                "benchmark": this.state.benchmark
            },
            "methods": this.state.selectedMethods,
            "files": files
        };
        this.createExecution(data);
    }

    createExecution(data) {
        const formData = new FormData();
        formData.append("methods", JSON.stringify(data.methods));
        formData.append("execution", JSON.stringify(data.execution));
        for (let key in data.files) {
            const item = data.files[key];
            formData.append("input", item.file, item.fileName);
        }
        console.log("FROM", formData);
        // TODO Add sending wait-dialog.
        // TODO Use better implementation, ie. move to API - action ?
        fetch("/api/v1/resources/executions", {
            "method": "POST",
            "body": formData
        }).then(() => {
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
