const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoConnection = require("./config/MongoDB");
const routes = require("./routes");
const path = require("path");
const app = express();
require("dotenv").config();

app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("combined"));
app.set("trust proxy", 1);
async () => await mongoConnection();

app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN,
		methods: "GET,PUT,POST,DELETE",
		credentials: true,
		preflightContinue: false,
		optionsSuccessStatus: 204,
	})
);

app.get("/", (req, res) => {
	res.status(200).json("Server is Running");
});

app.use(routes);

const PORT = process.env.PORT || 5454;

const server = app.listen(PORT, console.log(`Running on Port ${PORT}`));

module.exports = server;
