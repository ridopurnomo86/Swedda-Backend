const supabase = require("../../config/Supabase");

module.exports = {
	events_get: async (req, res) => {
		const { data } = await supabase.from("event").select();
		if (data) return res.status(200).json({ message: "Success", data });
		return res.status(500).send("Internal Server Error");
	},
};
