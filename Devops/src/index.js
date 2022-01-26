const express = require("express");
const userRouter = require("./routes/user");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "A simple Express user API made for the ECE-Devops-Project",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/user.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const port = process.env.PORT || 3000;

const db = require("./dbClient");
const swaggerJsdoc = require("swagger-jsdoc");
db.on("error", (err) => {
  console.error(err);
});

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World !!!"));

app.use("/user", userRouter);

const server = app.listen(port, (err) => {
  if (err) throw err;
  console.log("Server listening the port " + port);
});

process.on("SIGINT", () => {
  server.close();
});

module.exports = server;
