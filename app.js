// Require core Node.js modules
const path = require('path')

// Require non-core Node.js modules
const express = require('express');
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Require configuration files
const databaseConfiguration = require('./config/database');
const googleOAuthConfiguration = require('./config/googleoauth');

// Require route files
const index = require('./routes/index');
const auth = require('./routes/auth');

// Initialize the server
let app = express();

// Set path to static content
app.use('/public', express.static(path.join(__dirname, 'public')));

// Connect to database
mongoose.connect(databaseConfiguration.mongoURI)
.then(() => {
    console.log('Connected to database...');
})
.catch((error) => {
    throw error;
});

// Handlebars setup
app.engine('handlebars', exphbs({ defaultLayout: 'main'} ));
app.set('view engine', 'handlebars');

// Cookie parser setup
app.use(cookieParser());

// Express session setup
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}))

// Passport setup
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Set global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

// Route files setup
app.use('/', index);
app.use('/auth', auth);

// Set the port and start the server
const portNumber = process.env.PORT || 8080;
app.listen(portNumber, () => {
    console.log(`Server running on port ${portNumber}...`);
});