var env = process.env.NODE_ENV || "development";
const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const { Sequelize } = require("sequelize");
const randomstring = require("randomstring");
const redis = require("redis");
const Models = require("../models");
const { body } = require('express-validator'); // Correct import statement
const config = require(__dirname + "/../config/config.js")[env];



const router = express.Router();


//const groupController = require("../controllers/groupController");
const userController = require("../controllers/userController");
const preferencesController = require('../controllers/preferencesController');
const passwordController = require('../controllers/passwordController');

const groupRoutes = require('../routes/group');
const userRoutes = require('../routes/user');
const preferencesRoutes = require('../routes/preferences');
const passwordRoutes = require('../routes/password');

router.use('/groups', groupRoutes);
router.use('/users', userRoutes);
router.use('/preferences', preferencesRoutes);
router.use('/password', passwordRoutes);


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
  .post(userController.loginUser);

router.get("/dashboard", (req, res) => {
  if (req.session && req.cookies && req.cookies.user_sid) {
    console.log("User Info:", req.session.user);
    res.render("index", {
      title: "Dashboard",
      is_admin: req.session.user.is_admin,
    });
  } else {
    console.log("no sess or cook");
    console.log("Session Info:", req.session);
    res.redirect("/login");
  }
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erreur serveur');
});

// groups
router.get('/groups', groupController.manageGroups);
router.post('/groups/create', groupController.createGroup);
router.get('/groups/:group_id/destroy', groupController.destroyGroup);
router.get('/groups/:group_id/edit', groupController.editGroup);
router.post('/groups/:group_id/update', groupController.updateGroup);

//users
router.get('/users', userController.getAllUser);
router.get('/users/:userId', userController.getUserById);
router.post('/users/create', userController.createUser);
router.post('/users/:userId/update', userController.updateUser);
router.delete('/users/:userId/destroy', userController.deleteUser);
// Activer un utilisateur
router.get('/users/:userId/enable', userController.enableUser);
// Désactiver un utilisateur
router.get('/users/:userId/disable', userController.disableUser);
router.get("/logout", userController.logoutUser);
// Passsword upddate
router.get('/password', passwordController.showPasswordForm);
router.post('/updatepassword', passwordController.updatePassword);
// Display the form for editing user preferences
router.get('/preferences', preferencesController.showPreferencesForm);
// Handle form submission for updating user preferences

router.post(
  '/updatepref',
  [
    // Add express-validator validations here as needed
    body('login').notEmpty().withMessage('Login is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    // Add validations for other fields
  ],
  preferencesController.updatePreferences
);


module.exports = router;
