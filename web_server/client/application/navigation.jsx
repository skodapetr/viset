import React from "react";
import {Route, IndexRoute} from "react-router";
import {ExecutionList} from "../execution/list/execution-list-view";
import {ExecutionDetailView} from "../execution/detail/execution-detail-view";
import {ExecutionCreate} from "../execution/create/execution-create-view";
import {MethodList} from "../method/list/method-list-view";
import {MethodDetail} from "../method/detail/method-detail-view";
import {ApplicationLayout} from "./layout";

// TODO Add page for 404.
export function createRoutes() {
    return (
        <Route path="/" component={ApplicationLayout}>
            <IndexRoute component={ExecutionList}/>
            <Route path="execution" component={ExecutionList}/>
            <Route path="execution/create" component={ExecutionCreate}/>
            <Route path="execution/:id" component={ExecutionDetailView}/>
            <Route path="method" component={MethodList}/>
            <Route path="method/:id" component={MethodDetail}/>
        </Route>
    );
}

// TODO Tutorial for navigation https://codesandbox.io/s/mZRjw05yp
