const express = require("express");
const session = require("express-session");
const massive = require("massive");
const bodyParser = require("body-parser");
const ac = require("./controllers/authController");
const cookieParser = require("cookie-parser");
require("dotenv").config();
var cors = require("cors");

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(`${__dirname}/../build`));

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("db connected");
});

app.use(cookieParser());
app.use(
  session({
    key: "user_sid",
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
      expires: 600000
    }
  })
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    //res.redirect('/dashboard');
    return res.status(200).json(req.session.user);
  } else {
    next();
  }
};

// route for Home-Page
app.get("/", sessionChecker, (req, res) => {
  res.redirect("/login");
});

app.get("/devpool", ac.listDPTeams);
app.get("/devpool/members", ac.listDPMembers);
// app.get("/", function(req, res) {
//   res.cookie("name", "express").send("cookie set"); //Sets name = express
// });

app
  .route("/login")
  .get(sessionChecker, (req, res) => {
    res.status(200);
  })
  .post(ac.login);
app.get("/logout", ac.logout);
app.post("/register", ac.register);
app.put("/change_name", ac.edit);
app.post("/delete", ac.removeUser);

app.post("/db/join_team", ac.joinDPTeam);

const PORT = 3004;
app.listen(PORT, () => console.log(` - Listening on port (${PORT}) - `));
