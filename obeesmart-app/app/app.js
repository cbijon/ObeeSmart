"use strict";
// loading routes
const routes = require("./routes/index");
const user = require("./routes/user");
const group = require("./routes/group");
const centraleHarpes = require("./routes/centraleHarpes");
const harpe = require("./routes/harpe");
const ruche = require("./routes/ruche");
const scale = require("./routes/scale");
const screen = require("./routes/screen");
const token = require("./routes/token");
const preferences = require("./routes/preferences");
const password = require("./routes/password");
const log = require("./routes/log");



const apiUser = require("./controllers/userController");
const apiGroup = require("./controllers/groupController");
const apiCentraleHarpes = require("./controllers/centraleHarpesController");
const apiHarpe = require("./controllers/harpeController");
const apiRuche = require("./controllers/rucheController");
const apiScale = require("./controllers/scaleController");
const apiScreen = require("./controllers/screenController");
const apiToken = require("./controllers/tokenController");
const apiPreferences = require("./controllers/preferencesController");
const apiPassword = require("./controllers/passwordController");


const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
//const favicon = require('serve-favicon');
const logger = require("morgan");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
//const multer = require('multer');
const errorHandler = require("errorhandler");
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/config/config.js")[env];

const app = express();
const connectRedis = require("connect-redis");
const session = require("express-session");
const { createClient } = require("redis");
var randomstring = require("randomstring");

let client = createClient({
  url: `redis://${config.redis_host}:${config.redis_port}`,
  legacyMode: true,
});

const RedisStore = connectRedis(session);

client.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: client,
  prefix: "obeesmart:",
});

// initialize express-session to allow us track the logged-in
// user across sessions.
app.use(
  session({
    name: "user_sid",
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: "dfqskldfjlsdkfqksdflkqs",
    cookie: {
      maxAge: 1000 * 60 * 10,
      secure: false,
      httpOnly: false,
    },
  })
);

console.log(env);
console.log(config.redis_host);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger("dev"));
app.use(methodOverride());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(multer());
app.use(express.static(path.join(__dirname, "public")));




// routing
app.use("/", routes);
app.use("/groups", group);
app.use("/users", user);
app.use('/centraleHarpes', centraleHarpes);
app.use('/harpe', harpe);
app.use('/ruche', ruche);
app.use('/scale', scale);
app.use('/screen', screen);
app.use('/tokens', token);
app.use('/preferences', preferences);
app.use('/password', password);
app.use('/logs', log);


// routing
app.use("/api/groups", apiGroup);
app.use("/api/users", apiUser);
app.use('/api/centraleHarpes', apiCentraleHarpes);
app.use('/api/harpe', apiHarpe);
app.use('/api/ruche', apiRuche);
app.use('/api/scale', apiScale);
app.use('/api/screen', apiScreen);
app.use('/api/tokens', apiToken);
app.use('/api/preferences', apiPreferences);
app.use('/api/password', apiPassword);



// error handling middleware should be loaded after the loading the routes
if ("development" == app.get("env")) {
  app.use(errorHandler());
}

module.exports = app;
