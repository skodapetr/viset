import React from "react";
import {Link} from "react-router";
import {getCollectionDetailPath} from "./../../application/navigation";
import {Badge} from "reactstrap";

export const CollectionItem = ({data}) => {
    return (
        <div className="list-group-item flex-column align-items-start">
            <h5 className="mb-1">
                <Link to={getCollectionDetailPath(data.id)}>{data.label}</Link>

            </h5>
            <p className="mb-1">
                {data.description}
            </p>
            {data.downloaded && <Badge color="info">Downloaded</Badge>}
        </div>
    )
};
