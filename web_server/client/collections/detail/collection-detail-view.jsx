import React from "react";
import {connect} from "react-redux";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {
    fetchCollectionDetail,
    deleteCollectionDetail
} from "./../collection-action";
import {collectionDetailSelector} from "./../collection-reducer";
import {addLoadingIndicator} from "./../../components/loading-indicator";
import {Container} from "reactstrap";
import {Badge} from "reactstrap";

const CollectionDetailComponent = addLoadingIndicator(({data}) => (
    <Container>
        <div>
            <p><b>ID:</b> {data.id}</p>
            <p><b>Label:</b> {data.metadata.label}</p>
            <p><b>Description:</b> {data.metadata.description}</p>
        </div>
        <div>
            {
                Object.keys(data.data).map(key => (
                    <div key={key}>
                        <b>{key}</b>
                        <div style={{"marginLeft": "1REM"}}>
                        {
                            data.data[key].map((item, index) => (
                                <div key={index}>
                                    {item.dataset}{' - '}
                                    {item.selection}{' - '}
                                    {item.group}
                                    <br/>
                                    {data.downloaded && <Badge color="info">Downloaded</Badge>}
                                </div>
                            ))
                        }
                        </div>
                    </div>
                ))
            }
        </div>
    </Container>
));

class CollectionDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.initialize(this.props.params.id);
    }

    render() {
        const data = this.props.data;
        return (
            <CollectionDetailComponent
                isLoading={isLoadingSelector(data)}
                data={dataSelector(data)}/>
        )
    }

    componentWillUnmount() {
        this.props.destroy(this.props.params.id);
    }

}

export const CollectionDetailView = connect(
    (state, ownProps) => ({
        "data": collectionDetailSelector(state, ownProps.params.id),
    }),
    (dispatch, ownProps) => ({
        "initialize": (id) => {
            dispatch(fetchCollectionDetail(id));
        },
        "destroy": (id) => {
            dispatch(deleteCollectionDetail(id));
        }
    }))
(CollectionDetail);