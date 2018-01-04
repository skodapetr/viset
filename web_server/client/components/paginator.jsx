import React from "react";
import {PropTypes} from "prop-types";

export const Paginator = ({currentPage, pageCount, onPageChange}) => {
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

Paginator.propTypes = {
    "currentPage": PropTypes.number.isRequired,
    "pageCount": PropTypes.number.isRequired,
    "onPageChange": PropTypes.func.isRequired
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