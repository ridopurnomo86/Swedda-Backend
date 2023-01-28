const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
	let response;
	if (token !== "undefined") {
		jwt.verify(token, process.env.JWT_TOKENKEY, (err, payload) => {
			if (err) throw Error("Something Gone Wrong");
			return (response = payload);
		});
	}

	return response;
};

module.exports = verifyToken;
