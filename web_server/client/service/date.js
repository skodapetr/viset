export function dateToString(date) {
    if (date === undefined) {
        return "";
    }
    date = new Date(date);
    return date.getFullYear() +
        "-" + zfill(date.getMonth(), 2) +
        "-" + zfill(date.getDate(), 2) +
        " " + zfill(date.getHours(), 2) +
        ":" + zfill(date.getMinutes(), 2) +
        ":" + zfill(date.getSeconds(), 2);
}

function zfill(number, size) {
    const numberAsString = number.toString();
    const zeros = size - numberAsString.length + 1;
    return Array(+(zeros > 0 && zeros)).join("0") + number;
}