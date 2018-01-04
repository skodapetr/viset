import React from "react";
import {PropTypes} from "prop-types";

export const ItemList = ({
    "data":data,
    "keySelector" : keySelector,
    "itemComponent" : ItemComponent
}) => (
    <div className="list-group">
        {data.map((item) => (
            <ItemComponent key={keySelector(item)} data={item}/>
        ))}
    </div>
);

ItemList.propTypes = {
    "data": PropTypes.array.isRequired,
    "keySelector": PropTypes.func.isRequired,
    "itemComponent": PropTypes.func.isRequired
};

