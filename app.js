// Require core Node.js modules
const path = require('path')

// Require non-core Node.js modules
const express = require('express');
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

// Require configuration files
const keys = require('./config/keys');

// Require route files
const index = require('./routes/index');
const stories = require('./routes/stories');
const auth = require('./routes/auth');

// Initialize the server
let app = express();

// Connect to database
mongoose.connect(keys.mongoURI)
.then(() => {
    console.log('Connected to database...');
})
.catch((error) => {
    throw error;
});

// Handlebars helpers
const { truncate, stripHtmlTags, formatDate, select, editIcon } = require('./helpers/hbs');

// Handlebars setup
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        truncate: truncate,
        stripHtmlTags: stripHtmlTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    }
} ));
app.set('view engine', 'handlebars');

// Body parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cookie parser setup
app.use(cookieParser());

// Method override setup
app.use(methodOverride('_method'));

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

// Set path to static content
app.use('/public', express.static(path.join(__dirname, 'public')));

// Route files setup
app.use('/', index);
app.use('/stories', stories);
app.use('/auth', auth);

// Set the port and start the server
const portNumber = process.env.PORT || 8080;
app.listen(portNumber, () => {
    console.log(`Server running on port ${portNumber}...`);
});