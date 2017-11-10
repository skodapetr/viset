import React from "react";
import {PropTypes} from "prop-types";

const Table = ({data, selection, changeSelection}) => (
    <table style={{"border": "1px solid black", "marginBottom": "1rem"}}>
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
            if (value.id === selection.id) {
                style["backgroundColor"] = "#FFFDBA";
            }
            return (
                <tr key={index}
                    style={style}
                    onClick={() => changeSelection(value.id)}>
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

const Paginator = ({currentPage, pageCount, onPageChange}) => {
    const items = [];

    const pageStart = Math.max(0, currentPage - 2);
    const pageEnd = Math.min(currentPage + 2, pageCount);

    if (pageCount === 1) {
        return null;
    }

    if (pageStart > 0) {
        items.push(createPageItem(0, onPageChange, false));
    }

    for (let index = pageStart; index < pageEnd; ++index) {
        items.push(createPageItem(index, onPageChange, index === currentPage));
    }

    if (pageEnd < pageCount) {
        items.push(createPageItem(pageCount -1, onPageChange, false));
    }

    return (
        <ul className="pagination">
            {items}
        </ul>
    );
};

function createPageItem(value, onPageChange, isActive) {
    if (isActive) {
        return (
            <li className="page-item active" key={value}>
                <a className="page-link"> {value + 1} </a>
            </li>
        );
    } else {
        return (
            <li className="page-item"
                key={value}
                onClick={() => onPageChange(value)}>
                <a className="page-link"> {value + 1} </a>
            </li>
        );
    }
}

// TODO Move pagination into a reducer - would require extra reducer.
export class TableVisualization extends React.Component {

    constructor(props) {
        super(props);
        this.setPage = this.setPage.bind(this);
    }

    componentWillMount() {
        this.setState({"page": 0});
    }

    setPage(newPage) {
        this.setState({"page": newPage});
    }

    render() {
        const page = this.state.page;
        const pageSize = 20;
        const recordsCount = Object.keys(this.props.data).length;

        const pageData = [];
        let rangeStart = page * pageSize;
        const rangeEnd = Math.min((page + 1) * pageSize, recordsCount);

        if (rangeStart > rangeEnd - pageSize) {
            rangeStart = Math.max(0, rangeEnd - pageSize);
        }

        for (let index = rangeStart; index < rangeEnd; ++index) {
            pageData.push(this.props.data[index]);
        }

        return (
            <div>
                <Table data={pageData}
                       selection={this.props.selected}
                       changeSelection={this.props.changeSelection}
                />
                <Paginator
                    currentPage={page}
                    pageCount={Math.ceil(recordsCount / pageSize)}
                    onPageChange={this.setPage}
                />
            </div>
        )
    }

}

TableVisualization.propTypes = {
    "data": PropTypes.arrayOf(PropTypes.any).isRequired,
    // TODO Add support for multiple selected items.
    //"selected": PropTypes.arrayOf(PropTypes.string).isRequired,
    // TODO Rename to onChangeSelection
    "changeSelection": PropTypes.func
};