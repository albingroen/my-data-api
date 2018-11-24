const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");

const PORT = process.env.PORT || 3000;
let keys = {}
/*if (process.env.HEROKU) {
	console.log('Running in heroku')
	keys = require('./client_id.json');
} else {*/
keys = require('./client_id_marco.json');
//}

// Connect to MongoDB
var jsonParser = require("body-parser").json;

async function getClient(code) {
	const { google } = require("googleapis");
	try {
		const oauth2Client = new google.auth.OAuth2(
			keys.web.client_id,
			keys.web.client_secret,
			keys.web.redirect_uris[0]
		);

		// generate a url that asks permissions for Google+ and Google Calendar scopes
		const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];

		const url = oauth2Client.generateAuthUrl({
			// 'online' (default) or 'offline' (gets refresh_token)
			access_type: "offline",

			// If you only need one scope you can pass it as a string
			scope: scopes,
		});
		console.log("url", url);
		// Create google client?

		const { tokens } = await oauth2Client.getToken(code);
		console.log("token before set ", tokens);
		oauth2Client.setCredentials(tokens);
		console.log("token after");

		return oauth2Client;
	} catch (e) {
		console.error("failed to get google client");
		throw e;
	}
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
router.use("/my-data", require("./routes/my-data"));

var myAuth = async function(req, res, next) {
	try {
		if (req && req.query && req.query.code) {
			const code = req.query.code;
			// check cache for code from frontend
			if (Object.keys(users).includes(code)) {
				console.info("existing user");
				res.authenication = users[code];
			} else {
				console.info("new user");
				users[code] = {
					client: await getClient(code),
					loginTime: Date.now(),
				};
				res.authenication = users[code];
			}
		}
		next();
	} catch (e) {
		if (e.code == 400){
			console.error("code not valid")
			res.send({ error: "code not valid", code: e.code });
		}else{
			console.error(e)
			console.error("failed to authenticate")
			res.send({ error: "failed to authenticate user", code: e.code });
		}
	}
};
app.use(myAuth);
app.use("/v1", router);

const server = app.listen(PORT, () => {
	const { address, port } = server.address();
	console.log(`Listening at http://${address}:${port}`);
});
