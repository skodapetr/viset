import React from "react";
import {connect} from "react-redux";
import {Container, Button} from "reactstrap";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {addLoadingIndicator} from "./../../components/loading-indicator";
import {fetchDatasetDetail, requestDownload} from "./../dataset-action";
import {datasetDetailSelector} from "./../dataset-reducer";

// TODO Add downloading status.

const DownloadStatus = ({dataset, onDownload}) => {
    if (dataset.downloaded) {
        return (
            <p><b>Status:</b> Downloaded</p>
        )
    } else if (dataset.downloading) {
        return (
            <p><b>Status:</b> Downloading</p>
        )
    } else {
        return (
            <p><b>Status:</b> Not downloaded<br/>
                <Button size="sm" color="primary" onClick={onDownload}>
                    Download
                </Button>
            </p>
        )
    }
};

const DatasetDetailComponent = addLoadingIndicator(({dataset, onDownload}) => (
    <Container fluid={true}
               style={{
                   "border": "1px solid black",
                   "margin": "1REM",
                   "padding": "1REM"
               }}>
        <div>
            <p><b>ID:</b> {dataset.id}</p>
            <p><b>Label:</b> {dataset.label}</p>
            <DownloadStatus dataset={dataset} onDownload={onDownload}/>
        </div>

    </Container>
));

class DatasetDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.initialize(this.props.params.id);
    }

    render() {
        const dataset = this.props.dataset;
        return (
            <DatasetDetailComponent
                isLoading={isLoadingSelector(dataset)}
                dataset={dataSelector(dataset)}
                onDownload={this.props.onDownload}
            />
        )
    }

}

export const DatasetDetailView = connect(
    (state, ownProps) => ({
        "dataset": datasetDetailSelector(state, ownProps.params.id)
    }),
    (dispatch, ownProps) => ({
        "initialize": (id) => {
            dispatch(fetchDatasetDetail(id));
        },
        "onDownload": () => {
            dispatch(requestDownload(ownProps.params.id));
        }
    }))
(DatasetDetail);