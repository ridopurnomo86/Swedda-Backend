// HandleErrors
const handleErrors = (err) => {
	let errors = { email: "", password: "" };

	// Error Email
	if (err.message === "Incorrect Email") {
		errors.email = "Incorrect Email";
	}
	if (err.message === "Incorrect Password") {
		errors.password = "Incorrect Password";
	}

	// Error Code
	if (err.code === 11000) {
		errors.email = "Email is already registered";
		return errors;
	}

	// Validation Errors
	if (err.message.includes("user validation failed")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}
	return errors;
};

module.exports = handleErrors;
