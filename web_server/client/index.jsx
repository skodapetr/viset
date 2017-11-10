import React from "react";
import ReactDOM from "react-dom";
import {Router, browserHistory} from "react-router";
import {Provider} from "react-redux";
import {syncHistoryWithStore} from "react-router-redux";
import {createConfiguredStore} from "./store";
import {createRoutes} from "./application/navigation";

(() => {
    const store = createConfiguredStore();
    const history = syncHistoryWithStore(browserHistory, store);
    ReactDOM.render((
        <Provider store={store}>
            <Router history={history} routes={createRoutes()}/>
        </Provider>
    ), document.getElementById("app"));
})();

