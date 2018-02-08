import React from "react";
import {connect} from "react-redux";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {collectionListSelector} from "./../collection-reducer";
import {addLoadingIndicator} from "./../../components/loading-indicator";
import {FilteredItemList} from "./../../components/filtered-item-list";
import {fetchCollections} from "./../collection-action";
import {Container} from "reactstrap";
import {CollectionItem} from "./collection-list-item";

const LoadingAwareItemList = addLoadingIndicator(FilteredItemList);

class CollectionListContainer extends React.Component {

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
                    itemComponent={CollectionItem}
                    filterPredicate={searchPredicate}
                />
            </Container>
        );
    }
}

function searchPredicate(query, item) {
    return item.label.toUpperCase().search(query) > -1 ||
        item.description.toUpperCase().search(query) > -1;
}

export const CollectionList = connect(
    (state, ownProps) => ({
        "data": collectionListSelector(state)
    }),
    (dispatch, ownProps) => ({
        "fetchData": () => dispatch(fetchCollections())
    }))
(CollectionListContainer);
