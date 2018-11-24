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
	res.send("hej");
});

router.get("/auth/success", async function(req, res) {
	res.send("hej");
});

router.get("/google/callback", async function(req, res) {
	res.send("hej");
});

module.exports = router;
