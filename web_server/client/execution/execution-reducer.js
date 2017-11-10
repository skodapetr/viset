import {
    CLEAR_EXECUTION_LIST,
    FETCH_EXECUTION_LIST_REQUEST,
    FETCH_EXECUTION_LIST_SUCCESS,
    CLEAR_EXECUTION_DETAIL_LIST,
    FETCH_EXECUTION_DETAIL_REQUEST,
    FETCH_EXECUTION_DETAIL_SUCCESS,
    CLEAR_OUTPUT_REQUEST,
    FETCH_OUTPUT_REQUEST,
    FETCH_OUTPUT_SUCCESS,
    CLEAR_CREATE_EXECUTION,
    SET_CREATE_EXECUTION_METHOD,
    FETCH_CREATE_EXECUTION_METHOD_REQUEST,
    FETCH_CREATE_EXECUTION_METHOD_SUCCESS,
    UPDATE_FILTER,
    DELETE_FILTER,
    OPEN_FILTER_DIALOG,
    CLOSE_FILTER_DIALOG,
    UPDATE_SELECTION
} from "./execution-action";
import {
    STATUS_INITIAL,
    STATUS_FETCHING,
    STATUS_FETCHED
} from "./../service/data-access";

const REDUCER_NAME = "execution";

// TODO Introduce single resource management reducer for detail.methods.{}.outputs.
const INITIAL_STATE = {
    "detail": {
        "status": STATUS_INITIAL,
        "data": undefined,
    },
    "list": {
        "status": STATUS_INITIAL,
        "data": undefined
    },
    "create": {
        "methods": [],
        "definitions": {}
    },
    // TODO Move to another reducer ?
    "dashboard": {
        "selection": {},
        "outputs": {},
        // TODO Move filters to special component and use ID to bind.
        "filter": {
            "items": [
                {
                    "expression": "<",
                    "property": "order",
                    "value": 30
                }
            ],
            "dialog": {
                "index": undefined,
                "open": false,
                "data": undefined
            }
        },
        "filteredOutputs": {}
    }
};

// TODO Move transformations into separated functions?
// TODO Add action that clean the detail, method, list.
const REDUCER = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CLEAR_EXECUTION_LIST:
            return {
                ...state,
                "list": clearExecutionList()
            };
        case FETCH_EXECUTION_LIST_REQUEST:
            return {
                ...state,
                "list": fetchExecutionListRequest()
            };
        case FETCH_EXECUTION_LIST_SUCCESS:
            return {
                ...state,
                "list": fetchExecutionListSuccess(action)
            };

        case CLEAR_EXECUTION_DETAIL_LIST:
            return {
                ...state,
                "detail": clearExecutionDetail()
            };
        case FETCH_EXECUTION_DETAIL_REQUEST:
            return {
                ...state,
                "detail": fetchExecutionDetailRequest()
            };
        case FETCH_EXECUTION_DETAIL_SUCCESS:
            return {
                ...state,
                "detail": fetchExecutionDetailSuccess(action)
            };

        case CLEAR_OUTPUT_REQUEST:
            return {
                ...state,
                "dashboard": {
                    ... state["dashboard"],
                    "selection": [],
                    "outputs": {},
                    "filteredOutputs": {}
                }
            };
        case FETCH_OUTPUT_REQUEST:
            return {
                ...state,
                "dashboard": fetchOutputRequest(state["dashboard"], action)
            };
        case FETCH_OUTPUT_SUCCESS:
            return {
                ...state,
                "dashboard": fetchOutputRequestSuccess(state["dashboard"], action)
            };

        // TODO Replace with initialize, destroy actions.
        case CLEAR_CREATE_EXECUTION:
            return {
                ...state,
                "create": {
                    "methods": [],
                    "definitions": {}
                }
            };
        case SET_CREATE_EXECUTION_METHOD:
            return {
                ...state,
                "create": {
                    "methods": action.methods
                }
            };
        case FETCH_CREATE_EXECUTION_METHOD_REQUEST:
            return {
                ...state,
                "create": {
                    ...state.create,
                    "definitions": {
                        ...state.create.definitions,
                        [action.methodId]: {
                            "status": STATUS_FETCHING,
                            "data": undefined
                        }
                    }
                }
            };
        case FETCH_CREATE_EXECUTION_METHOD_SUCCESS:
            return {
                ...state,
                "create": {
                    ...state.create,
                    "definitions": {
                        ...state.create.definitions,
                        [action.methodId]: {
                            "status": STATUS_FETCHED,
                            "data": action.data
                        }
                    }
                }
            };
        case UPDATE_FILTER:
            if (action.index === -1 ){
                return {
                    ...state,
                    "dashboard": addFilter(state["dashboard"], action)
                };
            } else {
                return {
                    ...state,
                    "dashboard": updateFilter(state["dashboard"], action)
                };
            }
        case DELETE_FILTER:
            return {
                ...state,
                "dashboard":  deleteFilter(state["dashboard"], action)
            };
        case OPEN_FILTER_DIALOG:
            return {
                ...state,
                "dashboard": {
                    ...state["dashboard"],
                    "filter": {
                        ...state["dashboard"]["filter"],
                        "dialog": {
                            "index": action.index,
                            "open": true,
                            "data": state["dashboard"]["filter"]["items"][action.index]
                        }
                    }
                }
            };
        case CLOSE_FILTER_DIALOG:
            return {
                ...state,
                "dashboard": {
                    ...state["dashboard"],
                    "filter": {
                        ...state["dashboard"]["filter"],
                        "dialog": {
                            "open": false
                        }
                    }
                }
            };
        case UPDATE_SELECTION:
            return {
                ...state,
                "dashboard": {
                    ...state["dashboard"],
                    "selection": action.data
                }
            };
        default:
            return state;
    }
};

export default {
    "name": REDUCER_NAME,
    "reducer": REDUCER
};

function clearExecutionList() {
    return {
        "status": STATUS_INITIAL,
        "data": undefined
    };
}

function fetchExecutionListRequest() {
    return {
        "status": STATUS_FETCHING,
        "data": undefined
    };
}

function fetchExecutionListSuccess(action) {
    return {
        "status": STATUS_FETCHED,
        "data": action["data"]
    };
}

function clearExecutionDetail() {
    return {
        "status": STATUS_INITIAL,
        "data": undefined
    }
}

function fetchExecutionDetailRequest() {
    return {
        "status": STATUS_FETCHING,
        "data": undefined
    }
}

function fetchExecutionDetailSuccess(action) {
    return {
        "status": STATUS_FETCHED,
        "data": action["data"]
    };
}

function fetchOutputRequest(state, action) {
    const {fileName, methodId} = action;
    const key = getOutputKey(methodId, fileName);
    return {
        ...state,
        "outputs": {
            ...state["outputs"],
            [key]: {
                "status": STATUS_FETCHING,
                "data": undefined
            }
        }
    };
}

function getOutputKey(methodId, fileName) {
    return methodId + "/" + fileName;
}

function fetchOutputRequestSuccess(state, action) {
    const {fileName, methodId, data} = action;
    const key = getOutputKey(methodId, fileName);
    const outputs = {
        ...state["outputs"],
        [key]: {
            "status": STATUS_FETCHED,
            "data": data.data
        }
    };
    return {
        ...state,
        "outputs": outputs,
        "filteredOutputs": filterData(outputs, state.filter)
    };
}

// TODO Move filters to another file and optimize performance.
function filterData(outputs, filter) {
    const filteredIds = filterIds(outputs, filter);
    const filteredData = {};
    for (let key in outputs) {
        filteredData[key] = selectRecordsById(outputs[key].data, filteredIds);
    }
    return filteredData;
}

function filterIds(outputs, filter) {
    const result = {};
    for (let key in outputs) {
        const outputForMethod = outputs[key].data;
        let passing = createIdList(outputForMethod);
        for (let indexFilter in filter.items) {
            passing = filterIdsForMethod(
                outputForMethod, filter.items[indexFilter], passing)
        }
        // Merge results.
        for (let key in passing) {
            result[key] = 1;
        }
    }
    return result;
}

function createIdList(items) {
    const ids = {};
    for (let index in items) {
        ids[items[index].id] = 1;
    }
    return ids;
}

function filterIdsForMethod(items, filter, passing) {
    const ids = {};
    const threshold = filter.value;
    for (let index in items) {
        const item = items[index];
        if (passing[item.id] !== 1) {
            continue;
        }
        const itemValue = item[filter["property"]];
        switch (filter.expression) {
            case ">":
                if (itemValue > threshold) {
                    ids[item.id] = 1;
                }
                break;
            case "<":
                if (itemValue < threshold) {
                    ids[item.id] = 1;
                }
                break;
            default:
                break;
        }
    }
    return ids;
}

function addFilter(state, action) {
    const newFilter = {
        ...state["filter"],
        "items": [
            ...state["filter"]["items"],
            action.data
        ]
    };
    return {
        ...state,
        "filter" : newFilter,
        "filteredOutputs": filterData(state["outputs"], newFilter)
    };
    return state;
}

function updateFilter(state, action) {
    const items = [...state["filter"]["items"]];
    items[action.index]  = action.data;
    const newFilter = {
        ...state["filter"],
        "items": items
    };
    return {
        ...state,
        "filter" : newFilter,
        "filteredOutputs": filterData(state["outputs"], newFilter)
    };
}

function deleteFilter(state, action) {
    const newFilter ={
        ...state["filter"],
        "items": state.filter.items.filter(
            (item, index) => index !== action.index)
    };
    return {
        ...state,
        "filter" : newFilter,
        "filteredOutputs": filterData(state["outputs"], newFilter)
    };
    return state;
}

//
// Selectors
//

function selectRecordsById(data, ids) {
    const output = [];
    // TODO Use streaming (filter).
    for (let index in data) {
        const record = data[index];
        if (ids[record.id] === 1) {
            output.push(data[index]);
        }
    }
    return output;
}

export function selectListLoading(state) {
    return selectList(state).status !== STATUS_FETCHED;
}

function selectList(state) {
    return state.execution.list;
}

export function selectListData(state) {
    return selectList(state).data;
}

export function selectDetailLoading(state) {
    if (selectDetail(state).status !== STATUS_FETCHED) {
        return true;
    }
    return false;
}

function selectDetail(state) {
    return state.execution.detail;
}

export function selectDetailData(state) {
    return selectDetail(state).data;
}

export function selectDetailMethods(state) {
    const detail = selectDetail(state);
    if (detail.data == undefined) {
        return undefined;
    }

    const methods = {};

    Object.keys(detail.data["methods"]).forEach((key) => {
        const method = detail.data["methods"][key];
        methods[key] = {
            "id": key,
            "execution": detail.data["id"],
            "status": method["status"],
            "start": method["start"],
            "finish": method["finish"]
        };
    });

    return methods;
}

export function selectOutputLoading(state, fileName, methodId) {
    const output = selectOutput(state, fileName, methodId);
    return output === undefined || output.status !== STATUS_FETCHED;
}

function selectOutput(state, fileName, methodId) {
    const key = getOutputKey(methodId, fileName);
    const output = state.execution.dashboard.outputs[key];
    if (output == undefined) {
        return undefined;
    }
    return output;
}

export function selectOutputData(state, fileName, methodId) {
    const output = selectOutput(state, fileName, methodId);
    if (output === undefined) {
        return undefined;
    }
    return output.data;
}

// TODO Update to use REDUCER_NAME -> create select function

export function selectFilterDialogData(state) {
    return state.execution.dashboard.filter.dialog;
}

