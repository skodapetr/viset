import React from "react";
import {PropTypes} from "prop-types";
import {ItemList} from "./item-list";
import {Form, FormGroup, Label, Input} from "reactstrap";

const SearchBar = ({value, onChange}) => (
    <Form>
        <FormGroup>
            <Label for="search">Search</Label>
            <Input type="text"
                   name="search"
                   id="search"
                   value={value}
                   onChange={onChange}/>
        </FormGroup>
    </Form>
);

export class FilteredItemList extends React.Component {

    constructor(props) {
        super(props);
        this.updateQuery = this.updateQuery.bind(this);
        this.setSearchDataNoQuery = this.setSearchDataNoQuery.bind(this);
        this.setSearchDataForQuery = this.setSearchDataForQuery.bind(this);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            "query": "",
            "data": []
        }
    }

    componentWillMount() {
        this.setState({
            "data": this.props.data
        });
    }

    updateQuery(event) {
        if (event.target.value === "") {
            this.setSearchDataNoQuery();
        } else {
            this.setSearchDataForQuery(event);
        }
    }

    setSearchDataNoQuery() {
        this.setState({
            "query": "",
            "data": this.props.data
        });
    }

    setSearchDataForQuery(event) {
        const data = [];
        const searchQuery = event.target.value.toUpperCase();
        this.props.data.forEach((item) => {
            if (this.props.filterPredicate(searchQuery, item)) {
                data.push(item);
            }
        });
        this.setState({
            "query": event.target.value,
            "data": data
        });
    }

    render() {
        return (
            <div>
                <SearchBar value={this.state.query}
                           onChange={this.updateQuery}/>
                <ItemList
                    data={this.state.data}
                    keySelector={this.props.keySelector}
                    itemComponent={this.props.itemComponent}/>
            </div>
        )
    }

}

FilteredItemList.propTypes = {
    "data": PropTypes.array.isRequired,
    "keySelector": PropTypes.func.isRequired,
    "itemComponent": PropTypes.func.isRequired,
    "filterPredicate": PropTypes.func.isRequired
};
