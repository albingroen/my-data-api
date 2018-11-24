const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");

// Connect to MongoDB
var jsonParser = require("body-parser").json;

async function getClient(code) {
	const { google } = require("googleapis");

	const oauth2Client = new google.auth.OAuth2(
		"120720206824-cibobt957sd9rtmlu4l71toorl15ngap.apps.googleusercontent.com",
		"zQdH6u-ZYLmcAYqn4x2S3HsG",
		"http://localhost:8080/auth/google/callback"
	);

	// generate a url that asks permissions for Google+ and Google Calendar scopes
	const scopes = [
		"https://www.googleapis.com/auth/plus.me",
		"https://www.googleapis.com/auth/calendar",
	];

	const url = oauth2Client.generateAuthUrl({
		// 'online' (default) or 'offline' (gets refresh_token)
		access_type: "offline",

		// If you only need one scope you can pass it as a string
		scope: scopes,
	});

	// Create google client?

	const { tokens } = await oauth2Client.getToken(code);
	console.log("token before set ", tokens);
	oauth2Client.setCredentials(tokens);
	console.log("token after");

	return oauth2Client;
}

// Initialize http server
const app = express();
app.use(jsonParser());
app.use(cors());
const users = {};
const router = express.Router();

// Logger that outputs all requests into the console
// Use v1 as prefix for all API endpoints
router.use("/auth", require("./routes/auth"));

var myLogger = async function(req, res, next) {
	const code = req.body.code;
	// check cache for code from frontend
	// if users contains code
	if (code in users) {
		res.authenication = users[code];
	} else {
		users[code] = {
			client: await getClient(code),
			loginTime: Date.now(),
		};
	}

	console.log("users", Object.keys(users));
	next();
};
app.use(myLogger);
app.use("/v1", router);

const server = app.listen(3000, () => {
	const { address, port } = server.address();
	console.log(`Listening at http://${address}:${port}`);
});
