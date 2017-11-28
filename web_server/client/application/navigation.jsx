import React from "react";
import {Route, IndexRoute} from "react-router";
import {ExecutionList} from "../execution/list/execution-list-view";
import {ExecutionDetailView} from "../execution/detail/execution-detail-view";
import {ExecutionCreate} from "../execution/create/execution-create-view";
import {MethodList} from "../method/list/method-list-view";
import {MethodDetail} from "../method/detail/method-detail-view";
import {ApplicationLayout} from "./layout";

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

export const getExecutionsPath = () => "execution";

export const getExecutionCreatePath = () => "execution/create";

export const getExecutionDetailPath = (id) => "execution/" + id;

export const getMethodsPath = () => "method";

export const getMethodDetailPath = (id) => "method/" + id;
