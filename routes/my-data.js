const express = require("express");
const mongoose = require("mongoose");
const request = require("request");
const jwt = require("jsonwebtoken");
const MailClient = require('../mailClient.js');
var app = express();

const router = express.Router();

router.post("/", async function(req, res) {
	if (res.authenication === undefined) {
		res.send({ error: "login required" });
		return;
	}
	console.log('getting mail...');
	const client = res.authenication.client;
	const mailClient = new MailClient(client);
	const result = await mailClient.scrape();
	console.log(result);


	res.send("my data");
});
module.exports = router;
