const supabase = require("../../config/Supabase");
const { randomUUID } = require("crypto");
const verifyToken = require("../../modules/verifyToken");

module.exports = {
	catalog_get: async (req, res) => {
		const { data } = await supabase.from("catalog").select();
		if (data) return res.status(200).json({ message: "Success", data });
		return res.status(500).send("Internal Server Error");
	},
	catalog_by_id_get: async (req, res) => {
		const { id } = await req.params;
		const { data } = await supabase.from("catalog").select().eq("catalog_id", `${id}`);
		if (data) return res.status(200).json({ message: "Success", data: data[0] });
		return res.status(500).send("Internal Server Error");
	},
	catalog_comment_get: async (req, res) => {
		const { id } = await req.params;
		const { data } = await supabase.from("catalog_comment").select().eq("catalog_id", `${id}`);
		if (data) return res.status(200).json({ message: "Success", data });
		return res.status(500).send("Internal Server Error");
	},
	catalog_comment_post: async (req, res, next) => {
		const uuid = randomUUID();
		const { id } = await req.params;
		const { title, comment } = await req.body;
		try {
			const token = await req.cookies[`${process.env.COOKIE_USER}`];
			const username = await verifyToken(token).username;
			if (!token || !username) return res.status(401).send("Unauthorized");
			if (token && username) {
				const { data, error } = await supabase
					.from("catalog_comment")
					.insert([
						{
							post_id: uuid,
							catalog_id: id,
							author: username,
							content_text: comment,
							title,
						},
					])
					.eq("catalog_id", `${id}`);
				if (data) return res.status(200).json({ message: "Success" });
				if (error) return res.status(500).send("Internal Server Error");
			}
		} catch (err) {
			if (err) return res.status(500).send("Internal Server Error");
		}
		next();
	},
};
