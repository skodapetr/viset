import React from "react";
import {PropTypes} from "prop-types";
import {Row, Col, Button} from "reactstrap";
import {connect} from "react-redux";
import {
    filterDataInitializedSelector,
    filterDataSelector,
    dialogOpenSelector,
    dialogDataSelector
} from "./filter-reducer";
import {
    createFilter,
    destroyFilter,
    createFilterItem,
    deleteFilterItem,
    editFilterItem,
    cancelDialog,
    saveDialog
} from "./filter-action";
import {FilterDialog} from "./filter-dialog";

// TODO Improve visual.
const FilterRow = ({data, index, editItem, removeItem}) => (
    <Row style={{"marginBottom": "0.25rem"}}>
        <Col xs="10">
            {data.property} {data.type} {data.threshold}
        </Col>
        <Col xs="1">
            <Button color="primary"
                    style={{"width": "4rem"}}
                    onClick={() => editItem(index)}>
                Edit
            </Button>
        </Col>
        <Col xs="1">
            <Button color="danger"
                    style={{"width": "3rem"}}
                    onClick={() => removeItem(index)}>
                -
            </Button>
        </Col>
    </Row>
);

class FilterComponent extends React.Component {

    componentDidMount() {
        if (!this.props.isInitialized) {
            this.props.initialize();
        }
    }

    render() {
        const props = this.props;
        return (
            <div>
                {
                    props.data.map((item, index) => (
                        <FilterRow key={index}
                                   data={item}
                                   index={index}
                                   editItem={props.editItem}
                                   removeItem={props.removeItem}
                        />
                    ))
                }
                <Row style={{"marginBottom": "0.25rem"}}>
                    <Col xs="10"></Col>
                    <Col xs="1">
                        <Button color="success"
                                style={{"width": "4rem"}}
                                onClick={props.createItem}>
                            +
                        </Button>
                    </Col>
                </Row>
                <FilterDialog
                    isOpen={props.dialogOpen}
                    data={props.dialogData}
                    saveDialog={props.saveDialog}
                    cancelDialog={props.cancelDialog}/>
            </div>
        )
    }

    componentWillUnmount() {
        if (this.props.destroyOnUnmount) {
            this.props.destroy();
        }
    }

}

export const Filter = connect(
    (state, ownProps) => ({
        "data": filterDataSelector(state, ownProps.id),
        "dialogOpen": dialogOpenSelector(state),
        "dialogData": dialogDataSelector(state),
        "isInitialized" : filterDataInitializedSelector(state, ownProps.id)
    }),
    (dispatch, ownProps) => ({
        "initialize": () => dispatch(createFilter(ownProps.id)),
        "destroy": () => dispatch(destroyFilter(ownProps.id)),
        "editItem": (index) => dispatch(editFilterItem(ownProps.id, index)),
        "removeItem": (index) => dispatch(deleteFilterItem(ownProps.id, index)),
        "createItem": () => dispatch(createFilterItem(ownProps.id)),
        "saveDialog": (data) => dispatch(saveDialog(data)),
        "cancelDialog": () => dispatch(cancelDialog())
    }))
(FilterComponent);

Filter.propTypes = {
    "id": PropTypes.string.isRequired,
    "destroyOnUnmount": PropTypes.bool
};
