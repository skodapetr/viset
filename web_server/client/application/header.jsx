import React from "react";
import {
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Collapse,
    Nav,
    NavItem
} from "reactstrap";
import {Link} from "react-router";
import {
    getExecutionsPath,
    getMethodsPath,
    getDatasetsPath,
    getCollectionsPath
} from "./navigation";

const NavbarContent = () => (
    <Nav className="ml-auto" navbar>
        <NavItem>
            <Link to={getExecutionsPath()}
                  className="nav-link"
                  activeClassName="active">
                Executions
            </Link>
        </NavItem>
        <NavItem>
            <Link to={getMethodsPath()}
                  className="nav-link"
                  activeClassName="active">
                Methods
            </Link>
        </NavItem>
        <NavItem>
            <Link to={getDatasetsPath()}
                  className="nav-link"
                  activeClassName="active">
                Datasets
            </Link>
        </NavItem>
        <NavItem>
            <Link to={getCollectionsPath()}
                  className="nav-link"
                  activeClassName="active">
                Collections
            </Link>
        </NavItem>
    </Nav>
);

export class Header extends React.Component {

    constructor(props) {
        super(props);
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            "navbarOpen": false
        }
    }

    toggleNavbar() {
        this.setState({
            "navbarOpen": !this.state.navbarOpen
        });
    }

    render() {
        return (
            <Navbar toggleable="md" className="navbar-light">
                <NavbarBrand href="/">ViSeT</NavbarBrand>
                <NavbarToggler right onClick={this.toggleNavbar}/>
                <Collapse isOpen={this.state.navbarOpen} navbar>
                    <NavbarContent/>
                </Collapse>
            </Navbar>
        )
    }

}
