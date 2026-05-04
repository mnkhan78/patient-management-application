const WHO_DATA = require('../whoLMS.json');

function getWHOReference(ageInMonths, gender) {
    const data = WHO_DATA[gender];

    if (!data) return null;

    const ages = Object.keys(data).map(Number);

    // find closest age
    let closest = ages[0];

    for (let a of ages) {
        if (Math.abs(a - ageInMonths) < Math.abs(closest - ageInMonths)) {
            closest = a;
        }
    }

    return data[closest]; // { L, M, S }
}

module.exports = getWHOReference;