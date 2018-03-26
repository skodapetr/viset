import React from "react";
import {connect} from "react-redux";
import {fetchMethods} from "./../method-action";
import {methodListSelector} from "./../method-reducer";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {MethodItem} from "./method-list-item";
import {addLoadingIndicator} from "./../../components/loading-indicator";
import {FilteredItemList} from "./../../components/filtered-item-list";
import {Container} from "reactstrap";

const LoadingAwareItemList = addLoadingIndicator(FilteredItemList);

class MethodListContainer extends React.Component {

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
                    itemComponent={MethodItem}
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

export const MethodList = connect(
    (state, ownProps) => ({
        "data": methodListSelector(state)
    }),
    (dispatch, ownProps) => ({
        "fetchData": () => dispatch(fetchMethods())
    }))
(MethodListContainer);
