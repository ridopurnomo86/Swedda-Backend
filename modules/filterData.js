// filteredKeys must Array, and filteredValues must Object
const filterData = (filteredKeys, filteredValues) => {
	return Object.assign(
		{},
		...filteredKeys.map((key) => ({ [key]: filteredValues[key] }))
	);
};

module.exports = filterData;