const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

var cors = require("cors");
const express = require("express");
var bodyParser = require("body-parser");

const { EncryptionAlgorithm, DecryptionAlgorithm } = require("./utils");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/api/encrypt", (req, res) => {
  var plaintext = req.body.plaintext;
  const createdCipher = EncryptionAlgorithm(plaintext);
  res.send(createdCipher);
});

app.post("/api/decrypt", (req, res) => {
  var cipher = req.body.cipher;
  const plaintext = DecryptionAlgorithm(cipher);
  res.send(plaintext);
});

exports.app = functions.https.onRequest(app);
