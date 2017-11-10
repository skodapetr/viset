import React from "react";
import {PropTypes} from "prop-types";
import {
    Row,
    Col,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import {Field, reduxForm} from "redux-form";

const PropertyItem = ({index, data, removeItem, editItem}) => {
    return (
        <Row style={{"marginBottom": "0.25rem"}}>
            <Col xs="10">
                {data.property} {data.expression} {data.value}
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
};

const FilterItem = ({index, data, editItem, removeItem}) => {
    return (
        <PropertyItem
            index={index}
            data={data}
            editItem={editItem}
            removeItem={removeItem}
        />
    )
};

let FilterForm = ({cancelDialog, handleSubmit}) => {
    return (
        <form onSubmit={handleSubmit}>
            <ModalBody>
                <div>
                    <label>Property</label>
                    <div>
                        <Field name="property" component="select">
                            <option />
                            <option value="value">Score</option>
                            <option value="order">Order</option>
                        </Field>
                    </div>
                </div>
                <div>
                    <label>Expression</label>
                    <div>
                        <Field name="expression" component="select">
                            <option />
                            <option value="<">&lt;</option>
                            <option value=">">&gt;</option>
                        </Field>
                    </div>
                </div>
                <div>
                    <label>Value</label>
                    <div>
                        <Field
                            name="value"
                            component="input"
                            type="text"
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary"
                        type="submit">
                    Save
                </Button>
                {' '}
                <Button color="secondary" onClick={cancelDialog}>
                    Cancel
                </Button>
            </ModalFooter>
        </form>
    );
};

FilterForm = reduxForm({"form": "filter"})(FilterForm);

// TODO Add validation
let FilterDialog = ({data, saveDialog, cancelDialog}) => {
    return (
        <Modal isOpen={data.open} toggle={cancelDialog}>
            <ModalHeader toggle={cancelDialog}>Filter detail</ModalHeader>
            {/* TODO Extract Form to another component.*/}
            <FilterForm
                initialValues={data.data}
                onSubmit={(newData) => {
                    saveDialog(data.index, newData)
                }}
                cancelDialog={cancelDialog}
            />
        </Modal>
    )
};

// TODO Export to special reducer and connect to store.
export const Filter = ({data, editItem, removeItem, addItem, filterDialog, saveDialog, cancelDialog}) => {
    return (
        <div>
            {
                data.items.map((value, index) => (
                    <FilterItem
                        key={index}
                        index={index}
                        data={value}
                        editItem={editItem}
                        removeItem={removeItem}
                        saveDialog={saveDialog}
                        cancelDialog={cancelDialog}
                    />
                ))
            }
            <Row style={{"marginBottom": "0.25rem"}}>
                <Col xs="10"></Col>
                <Col xs="1">
                    <Button
                        color="success"
                        style={{"width": "4rem"}}
                        onClick={addItem}>
                        +
                    </Button>
                </Col>
            </Row>
            <FilterDialog
                data={filterDialog}
                saveDialog={saveDialog}
                cancelDialog={cancelDialog}
            />
        </div>
    );
};

