import React from "react";
import {Row, Col} from "reactstrap";

// TODO Center elements.
// TODO Implement layout based on the number of children.
export const DashboardLayout = (props) => {
    return (
        <Row>
            {props.children.map((item) => (
                <Col key={item.key}>
                    {item}
                </Col>
            ))}
        </Row>
    );
};