const express = require("express");
const randomstring = require("randomstring");
const Models = require("../models");
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "./../config/config.js")[env];
const asyncHandler = require("express-async-handler");
const queryTotalFrags = require("./../influx/queryTotalFrags"); //import query
const queryDemoScreen = require("./../influx/queryDemoScreen"); //import query

const app = express.Router();

const logAction = async (action, user_id, details) => {
  try {
    await Models.Log.create({
      action,
      details,
      user_id: user_id, // Assuming UserId is the association key for the user
    });
  } catch (error) {
    console.error("Error logging action:", error);
    // Handle the error as needed
  }
};
// Usage
// logAction('User Login', userId, { ipAddress: '127.0.0.1' });

app.use((req, res, next) => {
  if (!req.session.user && req.cookies) {
    res.clearCookie("user_sid");
    console.log("clearing cookie");
  }
  next();
});

const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect("/dashboard");
    console.log("sessionChecker: check logged-in user");
  } else {
    next();
  }
};

app.get("/data/totalfrelons", async (req, res) => {
/*  if (req.session && req.cookies && req.cookies.user_sid) {*/
    const data = await queryTotalFrags();
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify(data));
  //} else {
  //  console.log("no sess or cook");
  //  console.log("Session Info:", req.session);
  //  res.redirect("/login");
  //}
});

/* insecure req */
app.get("/data/demoscreen", async (req, res) => {
  const data = await queryDemoScreen();
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
});

app.get("/", sessionChecker, (req, res) => {
  res.redirect("/dashboard");
  console.log("redirect home page default");
});

app.get("/dashboard", (req, res) => {
  //if (req.session && req.cookies && req.cookies.user_sid) {
  console.log("User Info:", req.session.user);
  res.render("index", {
    title: "Dashboard",
    is_admin: req.session.user.is_admin,
  });
  /*} else {
    console.log("no sess or cook");
    console.log("Session Info:", req.session);
    res.redirect("/login");
  }*/
});

// route for user Login
app
  .route("/login")
  .get(sessionChecker, (req, res) => {
    res.render("login", {
      title: "Login page",
    });
    console.log("Login page loaded");
  })
  .post(
    asyncHandler(async (req, res) => {
      const email = req.body.email;
      const password = req.body.password;
      const user = await Models.User.findOne({
        where: {
          email: email,
        },
      });

      if (!user || !user.isEnable() || !user.validPassword(password)) {
        res.redirect("/login");
        console.log("Invalid credentials");
      } else {
        console.log("Login ok");
        req.session.user = user.dataValues;
        console.log(req.session.user);
        const ipAddress =
          req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        console.log("Client IP Address:", ipAddress);
        res.cookie("user_sid", randomstring.generate(), { maxAge: 10800 });
        logAction("User Login", req.session.user.id, {
          ipAddress: ipAddress,
        });
        res.redirect("/dashboard");
      }
    })
  );

// Logout utilisateur
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    logAction("User Logout", req.session.user.id, { ipAddress: ipAddress });
    res.clearCookie("user_sid");
    req.session.destroy();
    res.redirect("/");
    console.log("Logout successful");
  } else {
    res.redirect("/login");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Erreur serveur");
});

module.exports = app;
