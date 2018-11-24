const express = require("express");
const mongoose = require("mongoose");
const request = require("request");
const jwt = require("jsonwebtoken");

var app = express();

const router = express.Router();

router.get("/success", async function(req, res) {
	res.send("hej");
});

router.post("/success", async function(req, res) {
	console.log("req elelr", req.body.code);

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

	const { tokens } = await oauth2Client.getToken(req.body.code);
	oauth2Client.setCredentials(tokens);
	console.log("tokens", tokens);
	console.log("oauth2Client", oauth2Client);

	res.send("hej");
});

router.get("/auth/success", async function(req, res) {
	res.send("hej");
});

router.get("/google/callback", async function(req, res) {
	res.send("hej");
});

module.exports = router;
