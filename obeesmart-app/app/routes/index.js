var env = process.env.NODE_ENV || "development";
const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const { Sequelize } = require("sequelize");
const randomstring = require("randomstring");
const redis = require("redis");
const Models = require("../models");
const config = require(__dirname + "/../config/config.js")[env];

const router = express.Router();
console.log(env);
console.log(config.redis_host);

//const client = redis.createClient({url:'redis://'+config.redis_user+':'+config.redis_password+'@'+config.redis_host+':'+config.redis_port  });
const client = redis.createClient({
  url: "redis://" + config.redis_host + ":" + config.redis_port,
});
client.connect().catch(console.error);

client.on("error", (err) => console.log("Redis Client Error", err));


// Initialize store.
let redisStore = new RedisStore({
  client: client,
  prefix: "obeesmart:",
});

router.use(
  session({
    key: "user_sid",
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: randomstring.generate(),
    cookie: {
      expires: 600000,
    },
  })
);

router.use((req, res, next) => {
  if (!req.session.user && req.cookies) {
    res.clearCookie("user_sid");
    console.log("clearing cookie");
  }
  next();
});

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect("/dashboard");
    console.log("sessionChecker: check logged-in user");
  } else {
    next();
  }
};

router.get("/", sessionChecker, (req, res) => {
  res.redirect("/dashboard");
  console.log("redirect home page default");
});

router
  .route("/login")
  .get(sessionChecker, (req, res) => {
    res.render("login", {
      title: "ObeeSmart login page",
    });
    console.log("Login page loaded");
  })
  .post(async (req, res) => {
    try {
      var email = req.body.email;
      var password = req.body.password;
      const user = await Models.users.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        console.log("invalid email");
        return res.redirect("/login");
      }

      if (!user.isEnable()) {
        console.log("user disable");
        return res.redirect("/login");
      }

      if (!user.validPassword(password)) {
        console.log("invalid password");
        return res.redirect("/login");
      }

      console.log("Login ok");
      req.session.user = user.dataValues;
      console.log(req.session.user);
      res.cookie("user_sid", randomstring.generate(), { maxAge: 10800 });
      return res.redirect("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return res.redirect("/login");
    }
  });

router.get("/dashboard", (req, res) => {
  // Vérifiez si req.cookies est défini avant d'accéder à req.cookies.user_sid
  if (req.session && req.cookies && req.cookies.user_sid) {
    console.log("User Info:", req.session.user);
    res.render("index", {
      title: "Dashboard",
      is_admin: req.session.user.is_admin,
      is_manager: req.session.user.is_manager,
    });
  } else {
    console.log("no sess or cook");
    console.log("Session Info:", req.session);
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    req.session.destroy();
    res.redirect("/");
    console.log("Logout ok");
  } else {
    res.redirect("/login");
  }
});

// Exportez le client Redis si nécessaire
//module.exports = { router, client };
module.exports = router;
