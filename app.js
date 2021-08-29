const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

var secret = "thisissecret";
userSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["password"],
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets", (req, res) => {
  res.render("secrets");
});

app.post("/register", (req, res) => {
  const user = new User({
    email: req.body.username,
    password: req.body.password,
  });
  user.save((err) => {
    if (!err) {
      res.render("secrets");
      console.log("Registered successfully");
    } else {
      console.log(err);
    }
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }, (err, foundUser) => {
    if (!err) {
      if (foundUser.password === password) {
        res.render("secrets");
        console.log("Login successfully");
      }
    } else {
      console.log(err);
    }
  });
});

app.listen(port, () => {
  console.log("server listening on port 3000");
});
