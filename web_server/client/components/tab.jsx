import React from "react";
import {PropTypes} from "prop-types";
import {Nav, NavItem, NavLink, TabContent} from "reactstrap";
import classnames from "classnames";

const TabHeaderItem = ({component, onClick, isActiveTab}) => (
    <NavItem onClick={component.props.enabled ? onClick : undefined}>
        <NavLink
            className={classnames({
                "active": isActiveTab,
                "disabled": !component.props.enabled
            })}>
            {component.props.label}
        </NavLink>
    </NavItem>
);

TabHeaderItem.propTypes = {
    "component": PropTypes.any.isRequired,
    "onClick": PropTypes.func.isRequired,
    "isActiveTab": PropTypes.bool.isRequired
};

const TabsHeader = ({children, onClick, activeTab}) => (
    <Nav tabs style={{"marginLeft": "1rem", "marginRight": "1rem"}}>
        {children.map((component, index) => (
            <TabHeaderItem
                key={index}
                component={component}
                onClick={() => onClick(index)}
                isActiveTab={activeTab === index}
            />
        ))}
    </Nav>
);

TabsHeader.propTypes = {
    "children": PropTypes.array.isRequired,
    "onClick": PropTypes.func.isRequired,
    "activeTab": PropTypes.number.isRequired
};

export class Tabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.setActiveTab = this.setActiveTab.bind(this);
    }

    getInitialState() {
        return {
            "activeTab": 0,
        }
    }

    setActiveTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({"activeTab": tab});
        }
    }

    render() {
        const activeTab = this.props.children[this.state.activeTab];
        return (
            <div>
                <TabsHeader
                    children={this.props.children}
                    onClick={this.setActiveTab}
                    activeTab={this.state.activeTab}
                />
                <TabContent>
                    {activeTab}
                </TabContent>
            </div>
        )
    }

}
