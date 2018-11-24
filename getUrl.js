const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
	"120720206824-cibobt957sd9rtmlu4l71toorl15ngap.apps.googleusercontent.com",
	"zQdH6u-ZYLmcAYqn4x2S3HsG",
	"http://localhost:8080/auth/google/callback"
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
