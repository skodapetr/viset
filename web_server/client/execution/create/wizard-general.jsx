import React from "react";
import {Button, FormGroup, Label, Input} from "reactstrap";

export class WizardGeneral extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }

    getInitialState() {
        return {
            "label": "Created at " + (new Date()).getTime(),
            "description": "",
            "type": "default"
        }
    }

    render() {
        return (
            <div>
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
                <FormGroup>
                    <Label>Execution type</Label>
                    <FormGroup check>
                        <Label check>
                            <Input type="radio" value="default"
                                   onChange={(event) => this.setState({"type": event.target.value})}
                                   checked={this.state.type === "default"}/>
                            {" "}
                            Default
                        </Label>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input type="radio" value="benchmark"
                                   onChange={(event) => this.setState({"type": event.target.value})}
                                   checked={this.state.type === "benchmark"}/>
                            {" "}
                            Benchmark
                        </Label>
                    </FormGroup>
                </FormGroup>
                <Button onClick={this.onSubmitForm}>Next</Button>
            </div>
        )
    }

    onSubmitForm() {
        this.props.onSubmit({
            "label": this.state.label,
            "description": this.state.description,
            "type": this.state.type
        });
    }

}