const db = require("./db");
const express = require("express");
const cors = require("cors");
const authenticator = require("./authenticator");
const multer = require("multer");
const upload = multer();

const app = express();
const authenticate = authenticator({
  test_payload_email: process.env["TEST_PAYLOAD_EMAIL"],
  jwks_uri: "http://127.0.0.1:5556/dex/keys",
});

app.use(require("body-parser").json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(["<h1>ECE WebTech Chat</h1>"].join(""));
});

// Channels

app.get("/channelsUser/:email", async (req, res) => {
  const channels = await db.channels.list(req.params.email);
  res.json(channels);
});

app.post("/channels", async (req, res) => {
  const channel = await db.channels.create(req.body);
  res.status(201).json(channel);
});

app.get("/channels/:id", async (req, res) => {
  const channel = await db.channels.get(req.params.id);
  res.json(channel);
});

app.put("/channels/:id", (req, res) => {
  const channel = db.channels.update(req.params.id, req.body);
  res.json(channel);
});

app.delete("/channels/:id", async (req, res) => {
  const channel = await db.channels.delete(req.params.id);
  res.json(channel);
});

// Messages

app.get("/channels/:id/messages", async (req, res) => {
  try {
    const channel = await db.channels.get(req.params.id);
  } catch (err) {
    return res.status(404).send("Channel does not exist.");
  }
  const messages = await db.messages.list(req.params.id);
  res.json(messages);
});

app.post("/channels/:id/messages", async (req, res) => {
  const message = await db.messages.create(req.params.id, req.body);
  res.status(201).json(message);
});

app.put("/channels/:id/messages/:messageCreation", async (req, res) => {
  const message = db.messages.update(
    req.params.id,
    req.params.messageCreation,
    req.body
  );
  res.status(201).json(message);
});

app.delete("/channels/:id/messages/:messageCreation", async (req, res) => {
  const message = db.messages.delete(req.params.id, req.params.messageCreation);
  res.status(201).json(message);
});

// Users

app.get("/users", async (req, res) => {
  const users = await db.users.list();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = await db.users.create(req.body);
  res.status(201).json(user);
});

app.get("/users/:id", async (req, res) => {
  const user = await db.users.get(req.params.id);
  res.json(user);
});

app.put("/users/:id", async (req, res) => {
  const user = await db.users.update(req.params.id, req.body);
  res.json(user);
});

// Uploads

app.post("/uploads", upload.single("file"), async (req, res) => {
  await db.upload.create(req.file, req.body.idUser);
});

module.exports = app;
