import React from "react";
import {PropTypes} from "prop-types";
import {connect} from "react-redux";
import {fetchMethodDetail} from "./../method/method-action"
// import {fetchOutput} from "./../execution/execution-action"
// import {Col, Row} from "reactstrap";
// import {selectDetailLoading, selectDetailData} from "./../method/method-reducer"
// import {selectOutputLoading, selectOutputData} from "./../execution/execution-reducer"
// import {LoadingIndicator} from "./../components/loading-indicator"
// import {applyFilters} from "./filter"


const TableVisualisation = ({data, highlight, onClick}) => (
    <table style={{"border": "1px solid black"}}>
        <tbody>
        <tr>
            <th style={{
                "textAlign": "center",
                "border": "1px solid black",
                "width": "10rem"
            }}>
                Name
            </th>
            <th style={{
                "textAlign": "center",
                "border": "1px solid black",
                "width": "6rem"
            }}>
                Similarity
            </th>
            <th style={{
                "textAlign": "center",
                "border": "1px solid black",
                "width": "6rem"
            }}>
                Order
            </th>
        </tr>
        {data.map((value, index) => {
            const style = {};
            if (value.id === highlight) {
                style["backgroundColor"] = "#FFFDBA";
            }
            return (
                <tr key={index}
                    style={style}
                    onClick={() => onClick(value.id)}>
                    <td style={{
                        "textAlign": "center",
                        "border": "1px solid black"
                    }}>
                        {value.id}
                    </td>
                    <td style={{
                        "textAlign": "center",
                        "border": "1px solid black"
                    }}>
                        {value.value.toFixed(4)}
                    </td>
                    <td style={{
                        "textAlign": "center",
                        "border": "1px solid black"
                    }}>
                        {value.order}
                    </td>
                </tr>
            )
        })}
        </tbody>
    </table>
);

/**
 * Show visualisation of given data.
 */
class OutputVisualizer extends React.Component {

    render() {
        const {label, data, selected, changeSelection} = this.props;
        return (
            <div>
                {label}
                <br/>
                <TableVisualisation
                    data={data}
                    highlight={selected}
                    onClick={changeSelection}
                    />
            </div>
        )
    }

}

OutputVisualizer.propTypes = {
    "label": PropTypes.string.isRequired,
    "data": PropTypes.arrayOf(PropTypes.any).isRequired,
    "selected": PropTypes.any,
    "changeSelection": PropTypes.func.isRequired
};




/**
 * Provides visualisation for given data.
 */
class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        // this.prepareTilesData = this.prepareTilesData.bind(this);
        // this.createTile = this.createTile.bind(this);
        // this.changeSelection = this.changeSelection.bind(this);
    }

    componentWillMount() {
        // this.setState({"active": undefined});
        this.props.initialize();
        // TODO Move to dashboard actions.
        // Load details
        for (let index in this.props.methodsId) {
            const methodId = this.props.methodsId[index];
            this.props.fetchMethodDetail(methodId);
            // this.props.fetchOutput(methodId);
        }
    }

    render() {
        if (this.props.methodsId.length === 0) {
            return (
                <div>
                    No results to visualize.
                </div>
            );
        }
        return (
            <div>
                Dashboard
            </div>
        );

        // TODO Use better layout, ie. split to multiple rows..
        // const data = this.prepareTilesData();
        // return (
        //     <div>
        //         <h5>Filters</h5>
        //         <FilterComponent
        //             data={this.props.filter}
        //         />
        //         <h5>Scores</h5>
        //         <Row>
        //             {
        //                 this.props.methods.map(
        //                     (method) => this.createTile(method, data[method.id])
        //                 )
        //             }
        //         </Row>
        //     </div>
        // )
    }

    // prepareTilesData() {
    //     // TODO We should introduce caching and recompute only if filters are changed.
    //     const output = {};
    //     this.props.methods.forEach((method) => {
    //         if (method.isLoadingData) {
    //             return;
    //         }
    //         output[method.id] = method.output.data;
    //     });
    //
    //
    //     return applyFilters(output, this.props.filter);
    // }

    // createTile(method, data) {
    //     // TODO Be more specific here.
    //     if (method.isLoadingDefinition || data === undefined) {
    //         return (
    //             <Col key={method.id}>
    //                 <LoadingIndicator/>
    //             </Col>
    //         )
    //     }
    //     return (
    //         <Col key={method.id}>
    //             <OutputVisualizer
    //                 label = {method.definition.metadata.label}
    //                 data = {data}
    //                 selected = {this.state.active}
    //                 changeSelection={this.changeSelection}
    //             />
    //         </Col>
    //     )
    // }

    // changeSelection(newActive) {
    //     // TODO Move to store if it does not cause performance penalty.
    //     if (this.state.active === newActive) {
    //         this.setState({"active": undefined});
    //     } else {
    //         this.setState({"active": newActive});
    //     }
    // }

    componentWillUnmount() {
        this.props.cleanUp();
    }

}

export const DashboardContainer = connect(
    (state, ownProps) => ({
        // "filter": {
        //     "filters": [
        //         {
        //             "type": "topN",
        //             "n": 20
        //         },
        //         {
        //             "type": "propertyEvaluation",
        //             "property": "value",
        //             "value": 0.5,
        //             "operation": ">"
        //         }],
        //     "resultUnion" : true
        // },
        // "methods" : ownProps.methodsId.map((key) => ({
        //     "id": key,
        //     "isLoadingDefinition": selectDetailLoading(state, key),
        //     "definition": selectDetailData(state, key),
        //     "isLoadingData": selectOutputLoading(state,
        //         ownProps.fileName, key),
        //     "output": selectOutputData(state,
        //         ownProps.fileName, key)
        // }))
    }),
    (dispatch, ownProps) => ({
        "initialize": () => {

        },
        "fetchMethodDetail": (methodId) => dispatch(fetchMethodDetail(methodId)),
        // "fetchOutput": (methodId) => dispatch(fetchOutput(
        //     ownProps.executionId, methodId, ownProps.fileName)),
        "cleanUp": () => {

        }
    }))
(Dashboard);


DashboardContainer.propTypes = {
    "executionId": PropTypes.string.isRequired,
    "methodsId": PropTypes.arrayOf(PropTypes.string).isRequired
};

