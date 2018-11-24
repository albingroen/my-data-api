const express = require("express");
const mongoose = require("mongoose");
const request = require("request");
const jwt = require("jsonwebtoken");

var app = express();

const router = express.Router();

router.post("/", async function(req, res) {
	if (res.authenication === undefined) {
		res.send({ error: "login required" });
		return;
	}

	res.send("my data");
});
module.exports = router;
