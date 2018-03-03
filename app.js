// Require non-core Node.js modules
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Require configuration files
const databaseConfiguration = require('./config/database');
const googleOAuthConfiguration = require('./config/googleoauth');

// Initialize the server
let app = express();

// Route files setup
const auth = require('./routes/auth');
app.use('/auth', auth);

// Connect to database
mongoose.connect(databaseConfiguration.mongoURI)
.then(() => {
    console.log('Connected to database...');
})
.catch((error) => {
    throw error;
});

// Passport setup
require('./config/passport')(passport);

// Index route
app.get('/', (req, res) => {
    res.send('Hello world');
});

// Set the port and start the server
const portNumber = process.env.PORT || 8080;
app.listen(portNumber, () => {
    console.log(`Server running on port ${portNumber}...`);
});