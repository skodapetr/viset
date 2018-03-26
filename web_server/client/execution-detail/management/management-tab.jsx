import React from "react";
import {connect} from "react-redux";
import {Container, Button} from "reactstrap";
import {PropTypes} from "prop-types";
import {deleteExecution} from "../../execution/execution-api";
import {push} from "react-router-redux";

class _ManagementTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {};
    }

    componentWillMount() {
    }

    render() {
        const style = {
            "border": "1px solid black",
            "margin": "1REM",
            "padding": "1REM"
        };
        return (
            <Container fluid={true} style={style}>
                <Button size="sm"
                        color="danger"
                        onClick={this.props.onDelete}>
                    Delete execution
                </Button>
            </Container>
        )
    }

}

export const ManagementTab = connect(
    (state, ownProps) => ({}),
    (dispatch, ownProps) => ({
        "onDelete": () => {
            deleteExecution(ownProps.execution.id).then(() => {
                dispatch(push("/execution"));
            });
        }
    }))
(_ManagementTab);

ManagementTab.propTypes = {
    "execution": PropTypes.object.isRequired
};