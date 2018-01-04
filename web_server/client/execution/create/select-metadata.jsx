import React from "react";
import {Form, FormGroup, Label, Input} from "reactstrap";

export class SelectMetadata extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.onSubmit = this.onSubmit.bind(this);
    }

    getInitialState() {
        return {
            "label": "Created at " + (new Date()).getTime(),
            "description": ""
        }
    }

    render() {
        return (
            <Form>
                <FormGroup>
                    <Label for="label">Label</Label>
                    <Input type="text"
                           name="label"
                           id="label"
                           value={this.state.label}
                           onChange={(event) => this.setState({"label": event.target.value})}/>
                </FormGroup>
                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input type="textarea"
                           name="description"
                           id="description"
                           value={this.state.description}
                           onChange={(event) => this.setState({"description": event.target.value})}/>
                </FormGroup>
                <button onClick={this.onSubmit}>Next</button>
            </Form>
        )
    }

    onSubmit() {
        this.props.onSetMetadata({
            "label": this.state.label,
            "description": this.state.description
        });
    }

}