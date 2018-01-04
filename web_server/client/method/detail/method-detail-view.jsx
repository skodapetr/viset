import React from "react";
import {connect} from "react-redux";
import {fetchMethod, clearMethodsDetail} from "./../method-action";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {methodDetailSelector} from "./../method-reducer";
import {addLoadingIndicator} from "./../../components/loading-indicator";
import {Container} from "reactstrap";

const MethodDetailComponent = addLoadingIndicator(({data}) => (
    <div>
        <p><b>ID:</b> {data.metadata.id}</p>
        <p><b>Label:</b> {data.metadata.label}</p>
        <p><b>Description:</b> {data.metadata.description}</p>
    </div>
));

class MethodDetailContainer extends React.Component {

    componentDidMount() {
        this.props.fetchData(this.props.params.id);
    }

    render() {
        const data = this.props.data;
        return (
            <Container>
                <MethodDetailComponent
                    isLoading={isLoadingSelector(data)}
                    data={dataSelector(data)}
                />
            </Container>
        )
    }

}

export const MethodDetail = connect(
    (state, ownProps) => ({
        "data": methodDetailSelector(state, ownProps.params.id)
    }),
    (dispatch, ownProps) => ({
        "fetchData": (id) => dispatch(fetchMethod(id))
    }))
(MethodDetailContainer);