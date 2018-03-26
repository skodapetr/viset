import React from "react";
import {Link} from "react-router";
import {Badge} from "reactstrap";
import {getDatasetDetailPath} from "./../../application/navigation";

// Add badge for downloaded molecules
// Add information about number of downloaded selections

export const DatasetItem = ({data}) => {
    const doiLink = "https://doi.org/" + data.doi;
    return (
        <div className="list-group-item flex-column align-items-start">
            <h5 className="mb-1">
                <Link to={getDatasetDetailPath(data.id)}>{data.label}</Link>
            </h5>
            {data.doi &&
            <a href={doiLink} target="_blank">{data.doi}</a>
            }
            { data.downloaded &&
            <Badge color="info">Downloaded</Badge>
            }
            { data.downloading &&
            <Badge color="warning">Downloading</Badge>
            }
        </div>
    )
};
