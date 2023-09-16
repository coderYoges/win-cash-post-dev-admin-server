require("dotenv").config();

const fs = require("fs");
const https = require("https");  // Require the 'https' module.
const cors = require("cors");
const express = require("express");
const app = express();

const usersRouter = require("./src/routes/users");

const port = process.env.port || 25271;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/v1", (_, res) => {
  res.send({ message: "Admin server version 1.0 API's are available" });
});

app.use("/api/v1", usersRouter);

// Read your private key and certificate files
const privateKey = fs.readFileSync("privkey.pem", "utf8");
const certificate = fs.readFileSync("cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Win cash admin servers listening on port ${port}`);
});
