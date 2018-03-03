// Require non-core Node.js modules
const express = require('express');
const mongoose = require('mongoose');

// Require configuration files
const databaseConfiguration = require('./config/database');

// Initialize the server
let app = express();

// Connect to database
mongoose.connect(databaseConfiguration.db)
.then(() => {
    console.log('Connected to database...');
})
.catch((error) => {
    throw error;
});

// Index route
app.get('/', (req, res) => {
    res.send('Hello world');
});

// Set the port and start the server
const portNumber = process.env.PORT || 8080;
app.listen(portNumber, () => {
    console.log(`Server running on port ${portNumber}...`);
});