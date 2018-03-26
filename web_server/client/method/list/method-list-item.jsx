import React from "react";
import {Link} from "react-router";

export const MethodItem = ({data}) => (
    <div className="list-group-item flex-column align-items-start">
        <h5 className="mb-1">
            <Link to={"/method/" + data.id}>{data.label}</Link>
        </h5>
        <p className="mb-1">
            {data.description}
        </p>
    </div>
);