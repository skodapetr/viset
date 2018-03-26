export const TOGGLE_SELECTION = "TOGGLE_SELECTION";
export const CLEAR_SELECTION = "CLEAR_SELECTION";

export function toggleSelection(item) {
    return {
        "type": TOGGLE_SELECTION,
        "data": item
    }
}

export function clearSelection() {
    return {
        "type": CLEAR_SELECTION
    }
}
