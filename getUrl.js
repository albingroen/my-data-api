const { google } = require("googleapis");
const keys = require('./client_id_marco.json');

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
