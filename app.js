require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const https = require("https");
const PORT = process.env.PORT || 26630;
const SERVER = process.env.SERVER || "http://localhost";
require("module-alias/register");

//checking for .env file before starting application
const fs = require("fs");
const clc = require("cli-color");

(swaggerJsdoc = require("swagger-jsdoc")),
  (swaggerUi = require("swagger-ui-express"));

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + "/public"));

const { mongoConnect } = require("./utils/mongodb/connection");
mongoConnect();

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use("/", require("./routes"));

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:9200",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("*", (req, res) => {
  const error = {
    success: false,
    message: "404-Not Found",
    error: "The end point you are looking for is not found",
    description: "DRSH-404",
  };
  res.status(404).send(error);
});

// let server;
// const PRODUCTION = true;
// if (!PRODUCTION) {
//   console.log("starting server http Via Port",PORT);
//   server = http.createServer(app).listen(PORT);
// } else {
//   const options = {
//     key: fs.readFileSync(__dirname + "/capi.drsafehands.org.pem"),
//     cert: fs.readFileSync(__dirname + "/capi.drsafehands.org.crt"),
//     ca: fs.readFileSync(__dirname + "/capi.drsafehands.org.ca"),
//   };
//   console.log("starting server on https via port",process.env.PORT);
//   server = https.createServer(options, app).listen(process.env.PORT);
// }

app.listen(PORT, () => {
 console.log(`DRSH-NODE is runnuing at ${SERVER}:${PORT}`);
})
