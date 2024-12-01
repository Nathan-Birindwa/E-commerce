import express from "express";
import PasswordValidator from "password-validator";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
const app = express();
import pg from "pg";
import dotenv from "dotenv";
const saltRounds = 10;
// Port
const port = 3000;

dotenv.config();

// Connection to pg database
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", async (req, res) => {
  const firstName = req.body["firstName"];
  const lastName = req.body["lastName"];
  const email = req.body["email"];
  const password = req.body["password"];
  const confirmPassword = req.body["confirmPassword"];

  const data = await db.query("SELECT * FROM users WHERE email=$1", [email]);
  if (data.rows.length > 0) {
    console.log("The user already exists ");
  } else {
    // Password validation
    const schema = new PasswordValidator();
    schema
      .is()
      .min(8) // Minimum length 8
      .is()
      .max(100) // Maximum length 100
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .lowercase() // Must have lowercase letters
      .has()
      .digits(2) // Must have at least 2 digits
      .has()
      .not()
      .spaces() // Should not have spaces
      .is()
      .not()
      .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

    if (schema.validate(password) === false) {
      console.log("Use stronger password");
    } else {
      if (password === confirmPassword) {
        // Encrypting the password and saving the hash to the database
        bcrypt.hash(password, saltRounds, async function (err, hash) {
          // Store hash in your password DB.
          await db.query(
            "INSERT INTO users (first_name, email,  last_name, password, created_at) VALUES ($1, $2, $3, $4, $5)",
            [firstName, email, lastName, hash, new Date()]
          );
        });
      } else {
        console.log("Passwords dont't match");
      }
    }
  }
});

// Listen to port
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
