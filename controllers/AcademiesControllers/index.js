const verifyToken = require("../../modules/verifyToken");

module.exports = {
	academies_post: async (req, res, next) => {
		const token = await req.cookies[`${process.env.COOKIE_USER}`];

		if (token === null || !token || token === undefined) {
			res.status(401).json({
				type: "error",
				message: "Unauthorize",
			});
		}
		try {
			const userVerify = await verifyToken(token).is_verified;
			if (userVerify === false) {
				res.status(401).json({
					type: "error",
					message: "User need verify the email",
				});
			} else {
				res.status(200).json({
					type: "success",
					message: "Success",
				});
			}
		} catch (err) {
			if (err)
				return res.status(500).json({ message: "Something Gone Wrong", type: "error" });
		}

		next();
	},
};
