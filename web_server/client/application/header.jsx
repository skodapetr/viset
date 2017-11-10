import React from "react";
import {Navbar, NavbarToggler, NavbarBrand, Collapse, Nav, NavItem} from "reactstrap";
import {Link} from "react-router";

const NavigationComponent = () => (
    <Nav className="ml-auto" navbar>
        <NavItem>
            <Link to="/execution"
                  className="nav-link"
                  activeClassName="active">
                Executions
            </Link>
        </NavItem>
        <NavItem>
            <Link to="/method"
                  className="nav-link"
                  activeClassName="active">
                Methods
            </Link>
        </NavItem>
    </Nav>
);

class NavigationMenu extends React.Component {

    constructor(props) {
        super(props);
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.state = {
            "isOpen": false,
            "dropDownOpen": false
        };
    }

    toggleNavbar() {
        this.setState({
            "isOpen": !this.state.isOpen
        });
    }

    toggleDropDown() {
        this.setState({
            "dropDownOpen": !this.state.dropDownOpen
        });
    }

    render() {
        // TODO Add NavbarBrand
        // TODO Solve open button menu position on small devices
        return (
            <Navbar toggleable="md" className="navbar-light">
                <NavbarBrand href="/">ViSeT</NavbarBrand>
                <NavbarToggler right onClick={this.toggleNavbar}/>
                <Collapse isOpen={this.state.isOpen} navbar>
                    <NavigationComponent/>
                </Collapse>
            </Navbar>
        )
    }
}

export class Header extends React.Component {
    render() {
        return (
            <NavigationMenu/>
        )
    }
}