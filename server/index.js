import express from "express";
import bodyParser from "body-parser";
const app = express();

// Port
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", (req, res) => {});

// Listen to port
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
