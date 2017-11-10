import {createStore, compose, applyMiddleware} from "redux";
import reducers from "./reducer";
import thunk from "redux-thunk";
import {routerMiddleware} from "react-router-redux";
import {browserHistory} from "react-router";

export function createConfiguredStore(initialState = {}) {

    const enhancer = compose(
        applyMiddleware(thunk, routerMiddleware(browserHistory)),
        getDevToolMiddleware()
    );

    return createStore(reducers, initialState, enhancer);
}

function getDevToolMiddleware() {
    return window.devToolsExtension ? window.devToolsExtension() : f => f;
}