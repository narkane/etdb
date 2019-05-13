//const express = require("express");
//const session = require("express-session");
const massive = require("massive");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
//var session = require("client-sessions");
// var RedisStore = require("connect-redis")(session);
var redis = require("redis").createClient();
var cors = require("cors");
const bcrypt = require("bcryptjs");

// const ac = require("./controllers/authController");
require("dotenv").config();

var express = require("express"),
  app = express(),
  session = require("express-session");

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(bodyParser.json());
app.use(cors());
// app.use(express.static(`${__dirname}/../build`));

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("db connected");
});

app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      user: {
        username: "",
        password: ""
      }
    }
  })
);
app.use(cookieParser());

// app.use(
//   session({
//     cookieName: "doggie",
//     secret: SESSION_SECRET,
//     duration: 30 * 60 * 1000,
//     activeDuration: 5 * 60 * 1000,
//     httpOnly: true,
//     ephemeral: true,
//     cookie: {
//       secure: false
//     }
//   })
// );
// app.use(
//   session({
//     resave: false,
//     saveUninitialized: false,
//     secret: SESSION_SECRET,
//     store: new RedisStore({
//       host: "localhost",
//       port: 6379,
//       client: redis
//     })
//   })
// );

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
// app.use((req, res, next) => {
//   if (req.cookies.user_sid && !req.session.user) {
//     res.clearCookie("user_sid");
//   }
//   next();
// });

// // middleware function to check for logged-in users
// var sessionChecker = (req, res, next) => {
//   if (req.session.user && req.cookies.user_sid) {
//     //res.redirect('/dashboard');
//     return res.status(200).json(req.session.user);
//   } else {
//     next();
//   }
// };

// // route for Home-Page
// app.get("/", sessionChecker, (req, res) => {
//   res.redirect("/login");
// });

//
//
//
//
//
//
//
const register = async (req, res) => {
  const db = req.app.get("db");

  console.log(req.session);

  const user = await db.get_user([req.body.username]);
  const existinguser = user[0];
  if (existinguser || req.body.username == "") {
    return res.status(409).json("Username taken");
  } else {
    const hash = await bcrypt.hash(req.body.password, 12);
    let registereduser = await db.register_user([req.body.username, hash]);
    const user = registereduser[0];

    req.session.cookie.user = {
      username: user.username,
      password: req.body.password
    };
    req.session.save(err => {
      if (!err) {
        console.log(req.session);
      } else {
        console.log(err);
      }
    });
    // req.session.regenerate();
    //    res.status(201).json(req.body.username);
    res.sendStatus(201);
  }
};

const edit = async (req, res) => {
  const db = req.app.get("db");

  if (!(await db.get_user([req.body.newName]))[0]) {
    try {
      // check password
      const finduser = await db.get_user([req.body.oldName]);
      const user = finduser[0];

      if (!user) {
        res
          .status(401)
          .json(
            "User not found. Please register as a new user before logging in."
          );
      } else {
        const isAuthenticated = bcrypt.compareSync(
          req.body.password,
          user.hash
        );
        if (!isAuthenticated) {
          res.status(403).json("Incorrect username or password");
        } else {
          db.change_name([req.body.oldName, req.body.newName]);
          req.session.user = {
            username: req.body.newName
          };
          return res.status(200).json(req.session.user);
        }
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    return res.status(409).json("OMG that name EXISTS... DUH-amn");
    // const hash = await bcrypt.hash(req.body.password, 12);
    // let registereduser = await db.register_user([req.body.username, hash]);
    // const user = registereduser[0];
    // req.session.user = {
    //   username: user.username
  }
};

const login = async (req, res) => {
  const db = req.app.get("db");
  console.log("body: " + req.body.username);
  console.log(req.session);

  // if (!req.body.username && req.session.username) {
  //   req.body.username = req.session.username;
  //   console.log(req.body.username);
  // }
  const user = await db.get_user([req.body.username]);
  const existinguser = user[0];

  console.log("find user: " + JSON.stringify(existinguser));

  if (!existinguser) {
    res
      .status(401)
      .json("User not found. Please register as a new user before logging in.");
  } else {
    try {
      const isAuthenticated = bcrypt.compareSync(
        req.body.password,
        existinguser.hash
      );
      if (!isAuthenticated) {
        res.status(403).json("Incorrect username or password");
      } else {
        console.log("add username and pass to session user obj next...");
        // req.session.user = {
        // isAdmin: user.is_admin,
        // id: user.id,
        let userobj = {
          username: existinguser.username,
          password: req.body.password
        };
        req.session.cookie.user = userobj;
        req.session.save(err => {
          if (!err) {
            console.log(req.session);
          } else {
            console.log(err);
          }
        });

        // picture: user.picture,
        // name: user.name,
        // requested: user.amount_requested,
        // received: user.amount_received
        // };
        // console.log("LOGIN: REQ.SESH: " + JSON.stringify(req.session));
        // console.log("YOU DID IT! LOGIN!");
        // console.log(finduser[0]);
        //        res.status(200).json(existinguser);
        res.sendStatus(200);
      }
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }
};

const joinDPTeam = async (req, res) => {
  const db = req.app.get("db");

  const u_id = req.session.user.id;
  const team = req.body.team;
  const desc = req.body.desc;
  const lead = await db.get_user([req.body.lead]);
  console.log("user_id: ");
  console.log(u_id);
  console.log("\nlead_id: " + lead[0].id);

  let newDPentry = await db.join_DP_team([team, desc, lead[0].id, u_id]);
  // const user = registereduser[0];
  return res.status(201).json(newDPentry[0]);
};

const listDPMembers = async (req, res) => {
  const db = req.app.get("db");

  const findDPusers = await db.list_devpool_members();
  console.log(findDPusers);
  res.status(200).json(findDPusers);
};
const listDPTeams = async (req, res) => {
  const db = req.app.get("db");

  const findDPusers = await db.list_devpool_teams();
  console.log(findDPusers);
  res.status(200).json(findDPusers);
};

const logout = (req, res) => {
  req.session.destroy();
  res.status(200).json("YOU GONE!!");
};

const adminOnly = (req, res) => {
  res.status(200).json(req.session);
};

const removeUser = async (req, res) => {
  const db = req.app.get("db");

  console.log(req.session);

  const user = await db.get_user([req.body.username]);
  const existinguser = user[0];

  console.log("find user: " + JSON.stringify(existinguser));

  if (existinguser) {
    console.log(JSON.stringify(existinguser) + "\n user: " + req.body.username);
    //auth with sent password
    const isAuthenticated = bcrypt.compareSync(
      req.body.password,
      existinguser.hash
    );
    if (!isAuthenticated) {
      res.status(403).json("Incorrect username or password");
    } else {
      db.delete_user([req.body.username]);
      req.session.destroy();
      return res.status(200).json("User deleted!");
    }
  } else {
    console.log(existinguser + " |FAIL| " + req.session.username);
    return res.status(409).json("User doesn't exist? " + req.body.username);
  }
};

//
//
//
//
//
//
//

//
//
//
//
//
//
//

//
//
//
//
//
//
//
app.get("/devpool", listDPTeams);
app.get("/devpool/members", listDPMembers);
// app.get("/", function(req, res) {
//   res.cookie("name", "express").send("cookie set"); //Sets name = express
// });

// .get(sessionChecker, (req, res) => {
//   res.status(200);
// })
app.post("/login", login);
app.get("/logout", logout);
app.post("/register", register);
app.put("/change_name", edit);
app.post("/delete", removeUser);

app.post("/db/join_team", joinDPTeam);

const PORT = 3004;
app.listen(PORT, () => console.log(` - Listening on port (${PORT}) - `));
