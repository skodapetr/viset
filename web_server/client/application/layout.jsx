import React from "react";
import {Container} from "reactstrap";
import {Header} from "./header";

export class ApplicationLayout extends React.Component {
    render() {
        return (
            <Container>
                <Header/>
                {React.cloneElement(this.props.children, this.props)}
            </Container>
        );
    }
}
