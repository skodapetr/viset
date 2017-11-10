import React from "react";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
import {fetchMethodList} from "./../../method/method-action";
import {
    clearCreateExecution,
    setMethodsForCreateExecution,
    fetchMethod
} from "./../execution-action";
import {STATUS_FETCHED, STATUS_FETCHING} from "./../../service/data-access";
import { push } from 'react-router-redux'

const fileUploadInput = (props) => {
    return (
        <input type="file" onChange={props.input.onChange}/>
    )
};

const FileUploadComponent = (props) => {
    const {label, name} = props;
    return (
        <div>
            <label>{label}</label><br/>
            <Field
                name={name}
                component={fileUploadInput}
                type="file"
            />
        </div>
    )
};

// TODO Consider using wizard ( http://redux-form.com/7.0.3/examples/wizard/ )

//
// Dialog stage 1
//

const SelectExecutionsComponent = ({handleSubmit, methods}) => (
    <form onSubmit={handleSubmit}>
        SELECT METHODS:
        {methods.map((method) => (
                <div key={method.id}>
                    <Field name={method.id}
                           id={method.id}
                           component="input"
                           type="checkbox"/>
                    {method.label}
                </div>
            )
        )}
        <br/>
        <button type="submit">Select</button>
    </form>
);

const SelectExecutionsForm = reduxForm({
    "form": "executionCreateSelectMethods"
})(SelectExecutionsComponent);

//
// Execute stage 2
//

class ExecutionCreateComponent extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                {Object.values(this.props.description).map((item) => (
                    <FileUploadComponent
                        key={item.encodedKey}
                        label={item.label}
                        name={item.encodedKey}/>
                ))}
                <br/>
                <button type="submit">Submit</button>
            </form>
        )
    }
}

const ExecutionCreateForm = reduxForm({
    "form": "executionCreate"
})(ExecutionCreateComponent);

class ExecutionCreateComponentWrap extends React.Component {

    constructor(props) {
        super(props);
        this.createFormDescription = this.createFormDescription.bind(this);
        this.onCreateExecution = this.onCreateExecution.bind(this);
    }
    componentDidMount() {
        for (let index in this.props.methods) {
            this.props.fetchMethod(this.props.methods[index]);
        }
    }

    render() {
        // Check for loading ..
        if (this.props.methodsData === undefined) {
            return (
                <div>
                    Loading ...
                </div>
            )
        }
        for (let index in this.props.methods) {
            const methodId = this.props.methods[index];
            if (this.props.methodsData[methodId] === undefined ||
                this.props.methodsData[methodId].status == STATUS_FETCHING) {
                return (
                    <div>
                        Loading ...
                    </div>
                )
            }
        }
        // TODO Move to reducer ?
        this.description = this.createFormDescription(this.props.methodsData);
        return (
            <ExecutionCreateForm
                description={this.description}
                onSubmit={this.onCreateExecution}/>
        )
    }

    createFormDescription(methods) {
        // TODO Cache this value - move to reducer ??
        const formDescription = {};
        const processedId = {};
        let indexCounter = 0;
        for (let methodId in methods) {
            let inputs = methods[methodId].data.user_interface.input;
            for (let inputId in inputs) {
                if (processedId[inputId] === undefined) {
                    processedId[inputId] = 1;
                } else {
                    continue;
                }

                if (formDescription[inputId] !== undefined) {
                    continue;
                }
                //
                const value = methods[methodId].data.user_interface.input[inputId];
                const encodedKey = "file_" + indexCounter++;
                formDescription[encodedKey] = {
                    "fileName": inputId,
                    "encodedKey": encodedKey,
                    "label": value.label
                };
            }
        }
        return formDescription;
    }

    onCreateExecution(files) {
        const formData = new FormData();
        formData.append("methods", JSON.stringify(this.props.methods));
        console.log("Methods", this.props.methods);
        // Append files.
        for (let key in files) {
            const value = files[key];
            const fileName = this.description[key]["fileName"];
            formData.append("input", value[0], fileName);
        }
        // TODO Add sending wait-dialog.
        fetch("/api/v1/resources/executions", {
            "method": "POST",
            "body": formData
        }).then(() => {
            // TODO Use better implementation, ie. move to action.
            this.props.redirect();
        }) ;
    }

}

//
// Main dialog.
//

class ExecutionCreateContainer extends React.Component {

    constructor(props) {
        super(props);
        this.onSelectMethods = this.onSelectMethods.bind(this);
    }

    componentDidMount() {
        this.props.initialize();
        this.props.fetchMethodList();
    }

    render() {
        // TODO Move loading to other components.
        // TODO Create single loading component.
        if (this.props.loading) {
            // TODO Replace with better message.
            return (
                <div>Loading ...</div>
            );
        } else if (this.props.selectedMethods.length === 0) {
            return (
                <SelectExecutionsForm
                    methods={this.props.methodList}
                    onSubmit={this.onSelectMethods}/>
            );
        } else {
            // TODO Move some properties to mapping.
            return (
                <ExecutionCreateComponentWrap
                    methods={this.props.selectedMethods}
                    methodsData={this.props.create.definitions}
                    fetchMethod={this.props.fetchMethod}
                    history={this.props.history}
                    redirect={this.props.navigateToExecutionList}/>
            );
        }
    }

    onSelectMethods(formValues) {
        const selectedMethods = Object.keys(formValues);
        this.props.setMethods(selectedMethods);
    }

}

// TODO Add action to drop data on dismount.
const mapStateToProps = (state, ownProps) => ({
    "loading": state.method.list.status !== STATUS_FETCHED,
    "methodList": state.method.list.data,
    "selectedMethods": state.execution.create.methods,
    "create": state.execution.create,
    "history": ""
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "fetchMethodList": () => {
        // TODO Consider use of another controller.
        dispatch(fetchMethodList());
    },
    "initialize": () => {
        dispatch(clearCreateExecution());
    },
    "setMethods": (methods) => {
        dispatch(setMethodsForCreateExecution(methods));
    },
    "fetchMethod": (methodId) => {
        dispatch(fetchMethod(methodId));
    },
    "navigateToExecutionList" : () => {
        dispatch(push("/execution"))
    }
});

export const ExecutionCreate = connect(
    mapStateToProps,
    mapDispatchToProps)
(ExecutionCreateContainer);
