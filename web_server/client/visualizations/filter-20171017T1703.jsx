import React from "react";
import {Row, Col, FormGroup, Label, Input, Button} from "reactstrap";
import {connect} from "react-redux"

// TODO Implement filter interface.
// TODO Improve filter implementation, introduce concept of groups.
// TODO Export filtering functions to another file.
// TODO Implement as an independent component.






class Filter extends React.Component {

    constructor(props) {
        super(props);
        this.submitData = this.submitData.bind(this);
    }

    render() {
        const {data, updateFilter, multipleObjectFilter} = this.props;

        return (
            <div style={{"marginBottom": "2em"}}>


                <AddNewButton/>
                <br/>
                <Footer
                    data={data}
                    multipleObjectFilter={multipleObjectFilter}
                    onClick={this.submitData}
                    onUpdate={}/>
            </div>
        )
    }

    generateFilters(data, onRemove, onUpdate) {

    }

    submitData() {
        this.props.updateFilter(this.props.data);
    }

}

const TopNFilter = (({id, data, onRemove, onUpdate}) => (
    <Row style={{"marginBottom": "0.25rem"}}>
        <Col xs="1">
            <Button color="danger"
                    style={{"width": "3rem"}}
                    onClick={() => onRemove(id)}
            > - </Button>
        </Col>
        <Col xs="4">
            Show only top scoring molecules
        </Col>
        <Col xs="3">
            <Input name="number"
                   style={{"width": "5em"}}
                   value={data.value}/>
        </Col>
    </Row>
));

const PropertyEvaluation = ({id, data, properties, onRemove, onUpdate}) => (
    <Row style={{"marginBottom": "0.25rem"}}>
        <Col xs="1">
            <Button color="danger"
                    style={{"width": "3rem"}}
                    onClick={() => onRemove(id)}
            > - </Button>
        </Col>
        <Col xs="4">
            Property filter
        </Col>
        <Col xs="3">
            <Input type="select"
                   value={data.property}>
                {
                    properties.map((item) => (
                        <option>item</option>
                    ))
                }
            </Input>
        </Col>
        <Col xs="1">
            <Input type="select"
                   value={data.operation}>
                <option>&gt;</option>
                <option>&lt;</option>
                <option>=</option>
                <option>&gt;=</option>
                <option>&lt;=</option>
            </Input>
        </Col>
        <Col xs="2">
            <Input name="number"
                   style={{"width": "5em"}}
                   value={data.value}
            />
        </Col>
    </Row>
);


// TODO Add column with values to add.
const AddNewButton = ({onClick}) => (
    <Row>
        <Col xs="1">
            <Button color="success"
                    style={{"width": "3rem"}}
                    onClick={onClick}
            >+</Button>
        </Col>
    </Row>

);

const Footer = ({data, multipleObjectFilter, onClick, onUpdate}) => (
    <Row>
        <Col xs="4">
            {multipleObjectFilter &&
            <FormGroup>
                <Label>
                    <Input type="checkbox"
                           value={data.resultUnion}
                           onChange={(event) => onUpdate(
                               event.target.value, "resultUnion")}
                    />
                    {' '} Once pass show for all methods
                </Label>
            </FormGroup>
            }
        </Col>
        <Col xs="5">
        </Col>
        <Col xs="1">
            <Button color="primary" onClick={onClick}>Apply</Button>
        </Col>
    </Row>
);


export const FilterContainer = connect(
    (state, ownProps) => ({
        "data": selectFilter(ownProps.id)
    }),
    (dispatch, ownProps) => ({
        "initialize": createFilter(ownProps.id),
        "updateAction": (data) => dispatch(updateFilter(ownProps.id, data)),
        "destroy": destroyFilter(ownProps.id)
    })
)(Filter);



FilterComponent.propTypes = {
    "id": PropTypes.string.isRequired,
    "filter": PropTypes.any.isRequired,
    "updateFilter": PropTypes.func.isRequired,
    "multipleObjectFilter": PropTypes.boolean
};

//
//
//
//
//

/**
 *
 * @param dataSelector Return dictionary, each property contains array with data.
 */
export function addDataFilter(WrappedComponent, dataSelector, filters) {
    return (props) => {
        const inputData = dataSelector(props);
        const filteredData = applyFilters(inputData, filters);
        return (
            <WrappedComponent {...props} filteredData={filteredData}/>
        )
    };
}

export function applyFilters(inputData, filters) {
    console.time("apply filters");
    let filterObjects = createFilterObjects(inputData);

    filterObjects = filterTopN(inputData, filterObjects, {"n": 20});
    filterObjects = filterByFunction(inputData, filterObjects, {
        "filter": (item, filterObject) => item["value"] > 0.5
    });

    let output;
    if (false) {
        output = collectOutput(inputData, filterObjects);
    } else {
        output = collectVisibleInAllGroups(inputData, filterObjects);
    }
    console.timeEnd("apply filters");
    return output;
}

function createFilterObjects(inputData) {
    const output = {};
    for (let key in inputData) {
        const filterObjects = [];
        inputData[key].forEach((value, index) => {
            filterObjects.push({"index": index});
        });
        output[key] = filterObjects;
    }
    return output;
}

function callForEachGroup(inputData, filterObjects, filterFunction) {
    const outputData = {};
    for (let key in inputData) {
        outputData[key] = filterFunction(inputData[key], filterObjects[key]);
    }
    return outputData;
}

function filterTopN(inputData, filterObjects, params) {
    // console.time("filter top N");
    const filteredData = callForEachGroup(inputData, filterObjects,
        (groupData, groupFilterObjects) => {
            const output = [];
            for (let index = 0; index < params["n"]; ++index) {
                output.push(groupFilterObjects[index]);
            }
            return output;
        });
    // console.timeEnd("filter top N");
    return filteredData;
}

function filterByFunction(inputData, filterObjects, params) {
    // console.time("filter by function");
    const filterFunction = params["filter"];
    const filteredData = callForEachGroup(inputData, filterObjects,
        (groupData, groupFilterObjects) => {
            const output = [];
            groupFilterObjects.forEach((filterObject) => {
                const index = filterObject["index"];
                const passFilter = filterFunction(
                    groupData[index], filterObject);
                if (passFilter) {
                    output.push(groupFilterObjects[index]);
                }
            });
            return output;
        });
    // console.timeEnd("filter by function");
    return filteredData;
}

function collectOutput(inputData, filterObjects) {
    const outputData = {};
    for (let key in inputData) {
        const filteredData = [];
        const keyData = inputData[key];
        filterObjects[key].forEach((value) => {
            filteredData.push(keyData[value["index"]]);
        });
        outputData[key] = filteredData;
    }
    return outputData;
}

function collectVisibleInAllGroups(dataObjects, filterObjects) {
    const visibleIds = new Set();
    // Collect id.
    for (let key in dataObjects) {
        const groupObjects = dataObjects[key];
        filterObjects[key].forEach((value) => {
            const inputObject = groupObjects[value["index"]];
            visibleIds.add(inputObject["id"]);
        });
    }
    // Create output.
    const outputData = {};
    for (let key in dataObjects) {
        const filteredData = [];
        const groupObjects = dataObjects[key];
        groupObjects.forEach((value) => {
            if (visibleIds.has(value["id"])) {
                filteredData.push(value);
            }
        });
        outputData[key] = filteredData;
    }
    return outputData;
}

//
//
//
