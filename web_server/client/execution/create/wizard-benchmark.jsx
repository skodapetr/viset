import React from "react";
import {connect} from "react-redux";
import {LoadingIndicator} from "./../../components/loading-indicator";
import {Collapse, Button, FormGroup, Label, Input} from "reactstrap";
import {Link} from "react-router";
import {
    fetchDatasets,
    fetchDatasetDetail
} from "./../../dataset/dataset-action";
import {
    datasetListSelector,
    datasetDetailSelector
} from "./../../dataset/dataset-reducer";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {getDatasetDetailPath} from "./../../application/navigation";

// TODO Extract with DatasetItemComponent to another file.
const SelectionItem = ({selection, onChange}) => (
    <div>
        <div>
            {selection.label}
        </div>
        <div>
            {selection.groups.map(group => (
                <FormGroup check key={group}>
                    <Label check>
                        <Input type="checkbox"
                               onChange={() => onChange({
                                   "selection": selection.id,
                                   "group": group
                               })}
                        />
                        {" "}
                        {group}
                    </Label>
                </FormGroup>
            ))}
        </div>
    </div>
);

class DatasetItemComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.onToggleSelection = this.onToggleSelection.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
    }

    getInitialState() {
        return {"expanded": false};
    }

    componentDidMount() {
        this.props.initialize();
    }

    render() {
        const {isLoading, dataset} = this.props;
        if (isLoading) {
            // TODO Add nicer loading.
            return (
                <div>
                    <b>{dataset.label}</b>
                    <LoadingIndicator/>
                </div>
            )
        }

        if (!dataset.downloaded) {
            return (
                <div style={{"marginBottom": "1REM"}}>
                    <div>
                        <b>{dataset.label}</b>
                        <br/>
                        Not downloaded. <br/>
                        You can download the dataset in{" "}
                        <Link to={getDatasetDetailPath(dataset.id)}>
                            dataset detail
                        </Link>.
                    </div>
                </div>
            )
        }

        // TODO Add button for select/deselect all.
        return (
            <div style={{"marginBottom": "1REM"}}>
                <div>
                    <b>{dataset.label}</b>{" "}
                    <Button color="secondary" size="sm"
                            onClick={this.onCollapse}>
                        Toggle
                    </Button>
                    <br/>
                </div>
                <Collapse isOpen={this.state.expanded}>
                    {dataset.selections.map(selection => (
                        <SelectionItem key={selection.id}
                                       selection={selection}
                                       onChange={this.onToggleSelection}/>
                    ))}
                </Collapse>
            </div>
        )
    }

    onToggleSelection(data) {
        const id = this.props.dataset.id + data.selection + data.group;
        this.props.onToggle({
            "id": id,
            "dataset": this.props.dataset.id,
            "selection": data.selection,
            "group": data.group
        })
    }

    onCollapse() {
        this.setState({"expanded": !this.state.expanded});
    }

}

export const DatasetItem = connect(
    (state, ownProps) => {
        const datasetIndexRecord = ownProps.indexRecord;
        const datasetDetail = datasetDetailSelector(
            state, datasetIndexRecord.id);
        const isLoading = isLoadingSelector(datasetDetail);
        let detail;
        if (isLoading) {
            detail = {
                "id": ownProps.indexRecord.id,
                "label": ownProps.indexRecord.label
            }
        } else {
            detail = dataSelector(datasetDetail);
        }
        return {
            "isLoading": isLoading,
            "dataset": detail
        };
    },
    (dispatch, ownProps) => ({
        "initialize": () => {
            dispatch(fetchDatasetDetail(ownProps.indexRecord.id));
        }
    })
)(DatasetItemComponent);

class WizardBenchmarkComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.onToggleSelection = this.onToggleSelection.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
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
            )
        }
        // TODO Add support for search and filtering.
        return (
            <div>
                <div>
                    {this.props.datasets.map((dataset) => (
                        <DatasetItem onToggle={this.onToggleSelection}
                                     indexRecord={dataset}
                                     key={dataset.id}/>
                    ))}
                </div>
                <Button onClick={this.onSubmitForm}
                        disabled={!this.canSubmit()}>
                    Next
                </Button>
            </div>
        )
    }

    onToggleSelection(item) {
        if (this.state[item.id] === undefined) {
            this.setState({[item.id]: item});
        } else {
            this.setState({[item.id]: undefined});
        }
    }

    onSubmitForm() {
        const output = [];
        Object.keys(this.state).map((id) => {
            const value = this.state[id];
            if (value === undefined) {
                return;
            }
            output.push({
                "dataset": value.dataset,
                "selection": value.selection,
                "group": value.group
            });
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

export const WizardBenchmark = connect(
    (state, ownProps) => {
        const datasets = datasetListSelector(state);
        return {
            "isLoading": isLoadingSelector(datasets),
            "datasets": dataSelector(datasets),
        };
    },
    (dispatch, ownProps) => ({
        "initialize": () => {
            dispatch(fetchDatasets());
        }
    })
)(WizardBenchmarkComponent);
