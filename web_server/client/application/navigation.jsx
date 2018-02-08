import React from "react";
import {Route, IndexRoute} from "react-router";
import {ExecutionList} from "../execution/list/execution-list-view";
import {ExecutionDetailView} from "../execution/detail/execution-detail-view";
import {ExecutionCreate} from "../execution/create/execution-create-view";
import {MethodList} from "../method/list/method-list-view";
import {MethodDetail} from "../method/detail/method-detail-view";
import {DatasetList} from "../dataset/list/dataset-list-view"
import {CollectionList} from "../collections/list/collection-list-view"
import {DatasetDetailView} from "../dataset/detail/dataset-detail-view"
import {CollectionDetailView} from "../collections/detail/collection-detail-view"
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
            <Route path="dataset" component={DatasetList}/>
            <Route path="dataset/:id" component={DatasetDetailView}/>
            <Route path="collection" component={CollectionList}/>
            <Route path="collection/:id" component={CollectionDetailView}/>
        </Route>
    );
}

export const getExecutionsPath = () => "/execution";

export const getExecutionCreatePath = () => "/execution/create";

export const getExecutionDetailPath = (id) => "/execution/" + id;

export const getMethodsPath = () => "/method";

export const getMethodDetailPath = (id) => "/method/" + id;

export const getDatasetsPath = () => "/dataset";

export const getDatasetDetailPath = (id) => "/dataset/" + id;

export const getCollectionsPath = () => "/collection";

export const getCollectionDetailPath = (id) => "/collection/" + id;
