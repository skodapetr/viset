import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {executionListSelector} from "./../execution-reducer";
import {addLoadingIndicator} from "./../../components/loading-indicator";
import {FilteredItemList} from "./../../components/filtered-item-list";
import {getExecutionCreatePath} from "./../../application/navigation";
import {fetchExecutions} from "./../execution-action";
import {ExecutionItem} from "./execution-list-item";
import {Container} from "reactstrap";

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
                    itemComponent={ExecutionItem}
                    filterPredicate={searchPredicate}
                />
                <div style={{"marginTop": "1REM", "marginBottom": "2REM"}}>
                    <Link to={getExecutionCreatePath()}>
                        Create new execution
                    </Link>
                </div>
            </Container>
        );
    }
}

function searchPredicate(query, item) {
    return item.label.toUpperCase().search(query) > -1;
}

export const ExecutionList = connect(
    (state, ownProps) => ({
        "data": executionListSelector(state)
    }),
    (dispatch, ownProps) => ({
        "fetchData": () => dispatch(fetchExecutions())
    }))
(ExecutionListContainer);
