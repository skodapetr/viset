import React from "react";
import {PropTypes} from "prop-types";
import {
    FormGroup,
    Label,
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";

// TODO Use predefined "property" names

export class FilterDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.submitDialog = this.submitDialog.bind(this);
    }

    getInitialState() {
        return {
            "property": "",
            "type": "",
            "threshold": 0
        }
    }

    submitDialog() {
        const data = {
            "property" : this.state.property,
            "type" : this.state.type,
            "threshold" : this.state.threshold
        };
        this.props.saveDialog(data);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data === undefined) {
            this.setState({});
            return;
        }
        const data = nextProps.data.data;
        this.setState({
            "property": data.property,
            "type": data.type,
            "threshold": data.threshold
        });
    }

    render() {
        const {isOpen, cancelDialog} = this.props;
        return (
            <Modal isOpen={isOpen} toggle={cancelDialog}>
                <ModalHeader toggle={cancelDialog}>Filter detail</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <FormGroup>
                            <Label for="property">Property</Label>
                            <Input type="text"
                                   id="property"
                                   placeholder="Property name"
                                   onChange={(e) => this.setState({"property": e.target.value})}
                                   value={this.state.property}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="type">Type</Label>
                            <Input type="select"
                                   id="type"
                                   onChange={(e) => this.setState({"type": e.target.value})}
                                   value={this.state.type}>
                                <option>{"<"}</option>
                                <option>{"<="}</option>
                                <option>{"="}</option>
                                <option>{">="}</option>
                                <option>{">"}</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="threshold">Threshold</Label>
                            <Input type="number"
                                   id="threshold"
                                   placeholder="Threshold value"
                                   onChange={(e) => this.setState({"threshold": e.target.value})}
                                   value={this.state.threshold}/>
                        </FormGroup>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" type="submit" onClick={this.submitDialog}>
                        Save
                    </Button>
                    {' '}
                    <Button color="secondary" onClick={cancelDialog}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }

}

FilterDialog.propTypes = {
    "isOpen": PropTypes.bool.isRequired,
    "data": PropTypes.any,
    "saveDialog": PropTypes.func.isRequired,
    "cancelDialog": PropTypes.func.isRequired
};