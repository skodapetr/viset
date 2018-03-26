import React from "react";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {LoadingIndicator} from "./../../components/loading-indicator";
import {connect} from "react-redux";
import {fetchMethod} from "./../../method/method-action";
import {methodDetailSelector} from "./../../method/method-reducer";
import {Button} from "reactstrap";

const FileUpload = ({label, onChange}) => (
    <div style={{"marginBottom": "1REM"}}>
        {label} {" : "} <input type="file" onChange={onChange}/>
    </div>
);

export class WizardFilesComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.onFileSelect = this.onFileSelect.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }

    getInitialState() {
        return {
            "files": {},
            "description": {}
        }
    }

    componentDidMount() {
        this.props.initialize();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoading) {
            return;
        }
        this.setState({
            "description": this.createFormDescription(nextProps.methods)
        });
    }

    createFormDescription(methods) {
        const result = [];
        for (let index in methods) {
            const userInterface = methods[index].user_interface;
            let inputs = userInterface.input;
            for (let inputId in inputs) {
                if (result[inputId] !== undefined) {
                    continue;
                }
                const input = userInterface.input[inputId];
                if (this.props.isBenchmarkExecution && input.hideForBenchmark) {
                    continue;
                }
                result[inputId] = {
                    "id": inputId,
                    "fileName": inputId,
                    "label": input.label
                };
            }
        }
        return Object.values(result);
    }

    render() {
        if (this.props.isLoading) {
            return (
                <LoadingIndicator/>
            )
        }
        if (this.state.description.length === 0) {
            if (this.props.isBenchmarkExecution) {
                return (
                    <div>
                        There are no files required by selected methods.<br/>
                        Some files were by benchmarking data.<br/>
                        <br/>
                        <Button onClick={this.onSubmitForm}>
                            Create execution
                        </Button>
                    </div>
                )
            } else {
                return (
                    <div>
                        There are no files required by selected methods.<br/>
                        Some files were by benchmarking data.<br/>
                        <br/>
                        <Button onClick={this.onSubmitForm}>
                            Create execution
                        </Button>
                    </div>
                )
            }
        }
        return (
            <div>
                {this.state.description.map((item) => (
                    <FileUpload
                        key={item.id}
                        label={item.label}
                        onChange={(event) => this.onFileSelect(item.id, event)}
                    />
                ))}
                <br/>
                <Button onClick={this.onSubmitForm}>Select and create
                    execution
                </Button>
            </div>
        );

    }

    onFileSelect(id, event) {
        const fileInformation = event.target.files[0];
        this.setState({
            "files": {
                ... this.state.files,
                [id]: fileInformation
            }
        });
    }

    onSubmitForm() {
        // TODO Check for undefined values.
        const files = [];
        for (let index in this.state.description) {
            const item = this.state.description[index];
            const file = this.state.files[item.id];
            files.push({
                "file": file,
                "fileName": item.fileName
            })
        }
        this.props.onSubmit(files);
    }

}

export const WizardFiles = connect(
    (state, ownProps) => {
        let isLoading = false;
        let methods = {};

        ownProps.methodsId.map((id) => {
            const method = methodDetailSelector(state, id);
            isLoading |= isLoadingSelector(method);
            methods[id] = dataSelector(method);
        });

        return {
            "isLoading": isLoading,
            "methods": methods,
            "isBenchmarkExecution": ownProps.executionType === "benchmark"
        };
    },
    (dispatch, ownProps) => ({
        "initialize": () => {
            ownProps.methodsId.map((id) => dispatch(fetchMethod(id)));
        }
    })
)(WizardFilesComponent);