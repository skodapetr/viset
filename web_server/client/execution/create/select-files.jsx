import React from "react";
import {
    isLoadingListSelector,
    dataListSelector
} from "./../../service/repository";
import {LoadingIndicator} from "./../../components/loading-indicator";

const FileUpload = ({label, onChange}) => (
    <div style={{"marginBottom": "1REM"}}>
        {label} {" : "} <input type="file" onChange={onChange}/>
    </div>
);

export class SelectFiles extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.onFileSelect = this.onFileSelect.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    getInitialState() {
        return {
            "isLoading": true,
            "files": {},
            "description": {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.methods === nextProps.methods) {
            return;
        }
        const isLoading = isLoadingListSelector(nextProps.methods);
        this.setState({"isLoading": isLoading});
        if (isLoading) {
            return;
        }
        const methodsData = dataListSelector(nextProps.methods);
        this.setState({
            "description": this.createFormDescription(methodsData)
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
                result[inputId] = {
                    "id": inputId,
                    "fileName": inputId,
                    "label": userInterface.input[inputId].label
                };
            }
        }
        return Object.values(result);
    }

    render() {
        if (this.state.isLoading) {
            return (
                <LoadingIndicator/>
            )
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
                <button onClick={this.onSubmit}>Select and create execution</button>
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

    onSubmit() {
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
        this.props.onFilesSelected(files);
    }

}