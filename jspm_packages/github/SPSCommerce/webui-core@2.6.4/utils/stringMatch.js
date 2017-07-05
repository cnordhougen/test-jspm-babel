module.exports = stringMatch;

function stringMatch(a, b) {

    a = String(a).toLowerCase().trim();
    b = String(b).toLowerCase().trim();

    return a === b;
}
