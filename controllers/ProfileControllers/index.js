const User = require("../../models/userSchema");
const fs = require("fs");
const verifyToken = require("../../modules/verifyToken");
const filterData = require("../../modules/filterData");
const transporter = require("../../modules/emailTransporter");
const cloudinary = require("../../config/Cloudinary");
const emailTemplate = require("../../middleware/emailTemplate");
const createToken = require("../../modules/createToken");

module.exports = {
	user_info_get: async (req, res, next) => {
		const token = await req.cookies[`${process.env.COOKIE_USER}`];
		try {
			if (token) {
				const userId = verifyToken(token).id;
				const userInfo = await User.findById(userId);
				const filteredKeys = [
					"_id",
					"name",
					"username",
					"email",
					"gender",
					"birth_date",
					"is_verified",
					"image_poster",
				];
				const info = filterData(filteredKeys, userInfo);

				if (userInfo) return res.status(200).json({ message: "Success", info });
				if (!userInfo) return res.status(500).json({ message: "User Not Found" });
			}
		} catch (err) {
			if (err) return res.status(500).send("Internal Server Error");
		}
		next();
	},
	user_info_put: async (req, res, next) => {
		const token = await req.cookies[`${process.env.COOKIE_USER}`];
		const body = req.body;
		try {
			if (token) {
				const userId = verifyToken(token).id;
				const userInfo = await User.findByIdAndUpdate(userId, body, { new: true });

				if (userInfo) return res.status(200).json({ message: "Success Edit Profile" });
				if (!userInfo) return res.status(500).send("Internal Server Error");
			}
		} catch (err) {
			if (err) return res.status(500).send("Internal Server Error");
		}
		next();
	},
	user_profile_img_post: async (req, res, next) => {
		const token = await req.cookies[`${process.env.COOKIE_USER}`];
		if (token) {
			const userId = verifyToken(token).id;
			await cloudinary.uploader.upload(
				`${req.file.path}`,
				{ public_id: userId, folder: "avatars" },
				(err, result) => {
					if (result) {
						fs.unlinkSync(req.file.path);
						User.findByIdAndUpdate(
							userId,
							{ $set: { image_poster: result.secure_url } },
							{ new: true },
							(err, result) => {
								if (err) return console.log(err);
								if (result) return console.log(result);
							}
						);
						res.status(200).json({
							message: "Success Uploaded",
							result,
						});
					}
					if (err) {
						fs.unlinkSync(req.file.path);
						res.status(400).json({
							message: "someting went wrong while upload Image",
							data: err,
						});
					}
				}
			);
		} else {
			fs.unlinkSync(req.file.path);
			res.status(500).send("Internal Server Error");
		}
		next();
	},
	verify_user_post: async (req, res) => {
		const token = await req.cookies[`${process.env.COOKIE_USER}`];
		const verifyCredential = verifyToken(token);
		const { email, id, is_verified } = verifyCredential;
		const confirmationToken = createToken(id);

		if (is_verified === true)
			return res.status(200).send({
				message: "Email has verified",
				type: "success",
			});

		try {
			if (token && email) {
				const info = await transporter.sendMail({
					from: `Swedda-Team ${process.env.EMAIL_TRANSPORTER}`,
					to: email,
					subject: "Email Verification Swedda",
					html: emailTemplate(confirmationToken),
				});
				res.status(200).json({
					infoId: info.messageId,
					message: "Send Verification To Email",
				});
			}
			if (!token || !email)
				return res.status(500).send({ message: "Credential not exist", type: "error" });
		} catch (err) {
			if (err)
				return res.status(500).send({ message: "Internal Server Error", type: "error" });
		}
	},
	verify_user_get: async (req, res) => {
		const { id: token } = req.params;
		const currentId = await verifyToken(token).id;
		const findUserId = await User.findById(currentId);
		if (findUserId.is_verified === false) {
			const changeVerify = await User.updateOne(
				{ is_verified: false },
				{ $set: { is_verified: true } }
			);
			if (changeVerify) return res.status(200).json({ message: "Success Verified Account" });
		}
		return res.status(409).json({ message: "User Has Verified" });
	},
};
