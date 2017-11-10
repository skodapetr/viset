import React from "react";
import {connect} from "react-redux";
import {
    fetchExecutionDetail,
    clearExecutionDetail
} from "./../execution-action";
import {selectDetailLoading, selectDetailMethods} from "./../execution-reducer";
import {addLoadingIndicator} from "./../../components/loading-indicator";
import {MethodExecutionDetail} from "./execution-method-detail";
import {DashboardContainer} from "./../../dashboard/dashboard-container";
import {TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap";
import classnames from "classnames";
import {ItemDetail} from "./../../item-detail/item-detail";
import {TableVisualization} from "./../../visualizations/table-visualization"
import {HistogramComponent} from "./../../visualizations/histogram-visualisation"

// TODO Add general overview.
// TODO Change into tab layout.
const ExecutionMethodsList = addLoadingIndicator(({methods, executionId, activeTab, updateActiveTab}) => (
    <div>
        <h4>Execution detail</h4>
        <br/>
        <h5>Methods</h5>
        {Object.keys(methods).map((key) => (
            <MethodExecutionDetail key={key} execution={methods[key]}/>
        ))}
        <br/>
        <Nav tabs>
            <NavItem>
                <NavLink
                    className={classnames({"active": activeTab === "1"})}
                    onClick={() => {
                        updateActiveTab("1")
                    }}>
                    Results
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={classnames({"active": activeTab === "2"})}
                    onClick={() => {
                        updateActiveTab("2")
                    }}>
                    Histograms
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={classnames({"active": activeTab === "3"})}
                    onClick={() => {
                        updateActiveTab("3")
                    }}>
                    Molecule detail
                </NavLink>
            </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
                <br/>
                <DashboardContainer
                    showFilter={true}
                    executionId={executionId}
                    component={TableVisualization}
                    methodsId={Object.keys(methods).filter((id) => methods[id].status === "finished")}/>
            </TabPane>
            <TabPane tabId="2">
                <DashboardContainer
                    showFilter={false}
                    executionId={executionId}
                    component={HistogramComponent}
                    methodsId={Object.keys(methods).filter((id) => methods[id].status === "finished")}/>
            </TabPane>
            <TabPane tabId="3">
                <ItemDetail
                    executionId={executionId}
                    methodsId={Object.keys(methods).filter((id) => methods[id].status === "finished")}/>
            </TabPane>
        </TabContent>


    </div>
));

class ExecutionDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {"activeTab": "1"};
        this.updateActiveTab = this.updateActiveTab.bind(this);
    }

    updateActiveTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({"activeTab": tab});
        }
    }

    componentDidMount() {
        this.props.fetchData(this.props.params.id);
    }

    render() {
        const {loading, methods, params} = this.props;
        return (
            <ExecutionMethodsList
                isLoading={loading}
                methods={methods}
                executionId={params.id}
                activeTab={this.state.activeTab}
                updateActiveTab={this.updateActiveTab}
            />
        );
    }

    componentWillUnmount() {
        this.props.clearData();
    }

}

export const ExecutionDetailView = connect(
    (state, ownProps) => ({
        "loading": selectDetailLoading(state),
        "methods": selectDetailMethods(state)
    }),
    (dispatch, ownProps) => ({
        "fetchData": (id) => dispatch(fetchExecutionDetail(id)),
        "clearData": () => dispatch(clearExecutionDetail)
    }))
(ExecutionDetail);