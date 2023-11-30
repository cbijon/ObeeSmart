'use strict';

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const errorHandler = require('errorhandler');

// Import des nouveaux contrôleurs
const groupController = require("./controllers/groupController");
const userController = require("./controllers/userController");
const centraleHarpesController = require("./controllers/centraleHarpesController");
const harpeController = require("./controllers/harpeController");
const rucheController = require("./controllers/rucheController");
const scaleController = require("./controllers/scaleController");
const screenController = require("./controllers/screenController");
const tokenController = require("./controllers/tokenController");



// loading routes
const routes = require('./routes/index');
const user = require('./routes/user');
const group = require('./routes/group');
const centraleHarpes = require('./routes/centraleHarpes');
const harpe = require('./routes/harpe');
const ruche = require('./routes/ruche');
const scale = require('./routes/scale');
const screen = require('./routes/screen');
const token = require('./routes/token');



const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
//app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

// routing
app.use('/', routes);
app.use('/group', group);
app.use('/user', user);
app.use('/centraleHarpes', centraleHarpes);
app.use('/harpe', harpe);
app.use('/ruche', ruche);
app.use('/scale', scale);
app.use('/screen', screen);
app.use('/tokens', token);


// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

module.exports = app;
