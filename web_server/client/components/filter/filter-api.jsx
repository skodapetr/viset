export function createEmptyFilterItem() {
    return {
        "property": "",
        "type": "=",
        "threshold": 0
    }
}

export function filterList(filters, data) {
    console.time("filter-api.filterList");
    if (data === undefined) {
        return undefined;
    }
    const dataIndexes = Object.keys(data);
    const filteredIndexes = getMatchingIndexes(filters, dataIndexes, data);
    const result =  collectObjectWithIndexes(data, filteredIndexes);
    console.timeEnd("filter-api.filterList");
    return result;
}

function getMatchingIndexes(filters, keys, data) {
    const passing = [];
    for (let index in keys) {
        const key = keys[index];
        if (doObjectPassFilters(filters, data[key])) {
            passing.push(key);
        }
    }
    return passing;
}

function doObjectPassFilters(filters, object) {
    for (let index in filters) {
        const filter = filters[index];
        if (!doObjectPassFilter(filter, object)) {
            return false;
        }
    }
    return true;
}

function doObjectPassFilter(filter, object) {
    const value = object[filter.property];
    switch (filter.type) {
        case ">":
            return value > filter.threshold;
        case ">=":
            return value >= filter.threshold;
        case "=":
            return value === filter.threshold;
        case "<=":
            return value <= filter.threshold;
        case "<":
            return value < filter.threshold;
        default:
            console.error("Unknown filter type.", filter);
            throw new Error();
            return false;
    }
}

function collectObjectWithIndexes(data, keys) {
    const output = [];
    keys.forEach((key) => output.push(data[key]));
    return output;
}

export function filterMultipleLists(filters, lists) {
    console.time("filter-api.filterMultipleLists");
    const sharedKeys = getUnionOfMatchingKeys(filters, lists);
    const result =  collectObjectWithKeysFromLists(lists, sharedKeys);
    console.timeEnd("filter-api.filterMultipleLists");
    return result;
}

function getUnionOfMatchingKeys(filters, lists) {
    const sharedKeys = new Set();
    Object.keys(lists).forEach((key) => {
        const data = lists[key];
        getMatchingKeys(filters, data).forEach((item) => sharedKeys.add(item));
    });
    return sharedKeys;
}

function getMatchingKeys(filters, data) {
    const passing = [];
    for (let index in data) {
        const item  = data[index];
        if (doObjectPassFilters(filters, item)) {
            passing.push(item.id);
        }
    }
    return passing;
}

function collectObjectWithKeysFromLists(lists, keys) {
    const result = [];
    Object.keys(lists).forEach((key) => {
        const data = lists[key];
        result[key] = collectObjectWithKeys(data, keys);
    });
    return result;
}

function collectObjectWithKeys(data, keys) {
    const output = [];
    data.forEach((item) => {
        if (keys.has(item.id)) {
            output.push(item);
        }
    });
    return output;
}
