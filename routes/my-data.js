const express = require("express");
const mongoose = require("mongoose");
const request = require("request");
const jwt = require("jsonwebtoken");
const MailClient = require("../src/mailClient.js");
const app = require('../server');
const router = express.Router();

router.get("/", async function(req, res) {
	try {
		if (res.authenication === undefined) {
			res.send({ error: "login required" });
			return;
		}
		console.info("getting mail...");
		const client = res.authenication.client;
		const mailClient = new MailClient(client);
		const result = await mailClient.scrape();
		res.send(result);
		console.info("...success");
	} catch (e) {
		console.error("failed to get mail");
		console.error(e);
	}
});

router.get("/ping", async function(req, res) {
	const userCount = app.get('userCount');
	res.send(`pong ${userCount}`);
})
module.exports = router;
