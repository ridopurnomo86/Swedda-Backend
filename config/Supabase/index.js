const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseConnection = createClient(
	process.env.SUPABASE_URI,
	process.env.SUPABASE_PUBLIC_ANON_KEY
);

module.exports = supabaseConnection;
