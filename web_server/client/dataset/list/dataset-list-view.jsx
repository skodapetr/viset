import React from "react";
import {connect} from "react-redux";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {datasetListSelector} from "./../dataset-reducer";
import {addLoadingIndicator} from "./../../components/loading-indicator";
import {FilteredItemList} from "./../../components/filtered-item-list";
import {fetchDatasets} from "./../dataset-action";
import {Container} from "reactstrap";
import {DatasetItem} from "./dataset-list-item";

const LoadingAwareItemList = addLoadingIndicator(FilteredItemList);

class ExecutionListContainer extends React.Component {

    componentDidMount() {
        this.props.fetchData();
    }

    render() {
        const data = this.props.data;
        return (
            <Container>
                <LoadingAwareItemList
                    isLoading={isLoadingSelector(data)}
                    data={dataSelector(data)}
                    keySelector={item => item.id}
                    itemComponent={DatasetItem}
                    filterPredicate={searchPredicate}
                />
            </Container>
        );
    }
}

function searchPredicate(query, item) {
    return item.label.toUpperCase().search(query) > -1;
}

export const DatasetList = connect(
    (state, ownProps) => ({
        "data": datasetListSelector(state)
    }),
    (dispatch, ownProps) => ({
        "fetchData": () => dispatch(fetchDatasets())
    }))
(ExecutionListContainer);
