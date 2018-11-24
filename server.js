const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");

// Connect to MongoDB
var jsonParser = require("body-parser").json;

// Initialize http server
const app = express();
app.use(jsonParser());
app.use(cors());

const router = express.Router();

// Logger that outputs all requests into the console
// Use v1 as prefix for all API endpoints
router.use("/auth", require("./routes/auth"));

app.use("/v1", router);

const server = app.listen(3000, () => {
	const { address, port } = server.address();
	console.log(`Listening at http://${address}:${port}`);
});
