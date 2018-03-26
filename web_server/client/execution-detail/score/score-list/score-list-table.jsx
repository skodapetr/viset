import React from "react";
import {Paginator} from "./../../../components/paginator";
import {PropTypes} from "prop-types";
import {connect} from "react-redux";
import {initializeMethod, setMethodPage} from "./score-list-action";
import {initializedSelector, pageSelector} from "./score-list-reducer";

const PAGE_SIZE = 10;

const Table = ({data, selection, onRowClick}) => (
    <table style={{"border": "1px solid black", "marginBottom": "1rem"}}>
        <TableHeader/>
        <TableBody data={data} selection={selection} onRowClick={onRowClick}/>
    </table>
);

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

export class _ScoreListTable extends React.Component {

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
        if (props.data === undefined) {
            this.props.setPage(0);
            return;
        }

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
        console.time("score-list-table.selectDataForPage");
        const indexStart = page * PAGE_SIZE;
        const indexEnd = Math.min((page + 1) * PAGE_SIZE, data.length);
        const pagedData = [];
        for (let index = indexStart; index < indexEnd; ++index) {
            pagedData.push(data[index]);
        }
        console.timeEnd("score-list-table.selectDataForPage");
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

_ScoreListTable.propTypes = {
    "id": PropTypes.string.isRequired,
    "data": PropTypes.array.isRequired,
    "selection": PropTypes.array.isRequired,
    "onToggleSelection": PropTypes.func.isRequired,
};

// TODO We can move this to score-list and leave table only visual component.
export const ScoreListTable = connect(
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
(_ScoreListTable);