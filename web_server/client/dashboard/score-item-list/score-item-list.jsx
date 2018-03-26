import React from "react";
import {BaseDashboard} from "./../base-dashboard";
import {Paginator} from "./../../components/paginator";
import {PropTypes} from "prop-types";
import {connect} from "react-redux";
import {initializeMethod, setMethodPage} from "./score-item-list-action";
import {initializedSelector, pageSelector} from "./score-item-list-reducer";

const TableHeader = () => (
    <thead>
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
    </thead>
);

const TableRow = ({item, onRowClick, style}) => (
    <tr
        style={style}
        onClick={() => onRowClick(item)}>
        <td style={{
            "textAlign": "center",
            "border": "1px solid black"
        }}>
            {item.id}
        </td>
        <td style={{
            "textAlign": "center",
            "border": "1px solid black"
        }}>
            {item.value.toFixed(4)}
        </td>
        <td style={{
            "textAlign": "center",
            "border": "1px solid black"
        }}>
            {item.order}
        </td>
    </tr>
);

const TableBody = ({data, selection, onRowClick}) => (
    <tbody>
    {data.map((value, index) => {
        const style = {};
        if (selection.includes(value.id)) {
            style["backgroundColor"] = "#FFFDBA";
        }
        return (
            <TableRow key={index}
                      item={value}
                      onRowClick={onRowClick}
                      style={style}
            />
        )
    })}
    </tbody>
);

const Table = ({data, selection, onRowClick}) => (
    <table style={{"border": "1px solid black", "marginBottom": "1rem"}}>
        <TableHeader/>
        <TableBody data={data} selection={selection} onRowClick={onRowClick}/>
    </table>
);


class ScoreItemListTileComponent extends React.Component {

    constructor(props) {
        super(props);
        this.updatePagination = this.updatePagination.bind(this);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            "pageCount": 0,
            "activePageData": []
        }
    }

    componentWillMount() {
        if (!this.props.isInitialized) {
            this.props.initialize();
        }
        this.updatePagination(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data ||
            this.props.page !== nextProps.page) {
            this.updatePagination(nextProps);
        }
    }

    updatePagination(props) {
        const pageCount = Math.ceil(props.data.length / PAGE_SIZE);
        this.setState({
            "pageCount": pageCount,
            "activePageData": this.selectDataForPage(props.page, props.data)
        });
        if (this.props.page >= pageCount) {
            this.props.setPage(0);
        }
    }

    selectDataForPage(page, data) {
        console.time("score-item-list.selectDataForPage");
        const indexStart = page * PAGE_SIZE;
        const indexEnd = Math.min((page + 1) * PAGE_SIZE, data.length);
        const pagedData = [];
        for (let index = indexStart; index < indexEnd; ++index) {
            pagedData.push(data[index]);
        }
        console.timeEnd("score-item-list.selectDataForPage");
        return pagedData;
    }

    render() {
        const {selection, onToggleSelection} = this.props;
        return (
            <div>
                <Table data={this.state.activePageData}
                       selection={selection}
                       onRowClick={onToggleSelection}
                />
                {this.state.pageCount > 0 &&
                <Paginator
                    currentPage={this.props.page}
                    pageCount={this.state.pageCount}
                    onPageChange={this.props.setPage}/>
                }
            </div>
        )
    }

}

ScoreItemListTileComponent.propTypes = {
    "id": PropTypes.string.isRequired,
    "data": PropTypes.array.isRequired,
    "selection": PropTypes.array.isRequired,
    "onToggleSelection": PropTypes.func.isRequired,
};

const ScoreItemListTile = connect(
    (state, ownProps) => ({
        "page": pageSelector(state, ownProps.id),
        "isInitialized": initializedSelector(state, ownProps.id)
    }),
    (dispatch, ownProps) => ({
        "initialize": () => {
            dispatch(initializeMethod(ownProps.id));
        },
        "setPage": (page) => dispatch(setMethodPage(ownProps.id, page))
    }))
(ScoreItemListTileComponent);

export const ScoreItemListDashboard = (props) => {
    const {execution, selection, onToggleSelection} = props;
    return (
        <BaseDashboard
            execution={execution}
            component={ScoreItemListTile}
            selection={selection}
            onToggleSelection={onToggleSelection}
            filtersId={"score-item-list"}/>
    )
};


