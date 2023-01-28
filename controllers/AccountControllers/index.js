const User = require("../../models/userSchema");
const filterData = require("../../modules/filterData");
const createToken = require("../../modules/createToken");
const handleErrors = require("../../modules/handleError");

module.exports = {
	signup_post: async (req, res, next) => {
		const { username, email, password, name } = req.body;
		try {
			const user = await User.create({ name, username, email, password });
			if (!user) return res.status(500).send("Internal Server Error");
			res.status(200).json({
				user: user._id,
				message: "Success Create User",
			});
		} catch (error) {
			const errors = handleErrors(error);
			if (errors) return res.status(409).json({ message: errors.email || errors.password });
		}
		next();
	},
	signin_post: async (req, res, next) => {
		const { email, password } = req.body;
		try {
			const filteredKeys = ["username", "email", "gender", "is_verified"];
			const user = await User.login(email, password);
			const userInfo = filterData(filteredKeys, user);
			const token = createToken(user._id, userInfo);
			return res
				.status(200)
				.cookie(`${process.env.COOKIE_USER}`, token, {
					maxAge: 18000000, // 5 Hours/ms,
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					domain:
						process.env.NODE_ENV === "production" ? process.env.SUB_DOMAIN_COOKIE : "",
					sameSite: process.env.NODE_ENV === "production" && "None",
				})
				.json({ user: user._id, message: "Success Login", token });
		} catch (error) {
			const errors = handleErrors(error);
			res.status(401).json({ error: "Cannot Login", errorMessage: errors });
		}
		next();
	},
	logout_get: async (req, res, next) => {
		const token = await req.cookies[`${process.env.COOKIE_USER}`];
		try {
			if (!token) return res.status(401).json({ message: "Unauthorized" });
			res.cookie(`${process.env.COOKIE_USER}`, token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				domain: process.env.NODE_ENV === "production" ? process.env.SUB_DOMAIN_COOKIE : "",
				sameSite: process.env.NODE_ENV === "production" && "None",
			});
			res.status(200).cookie(`${process.env.COOKIE_USER}`, "", { maxAge: 0 }).json({
				message: "Success Logout",
			});
		} catch (error) {
			res.status(500).send("Internal Server Error");
		}
		next();
	},
};
