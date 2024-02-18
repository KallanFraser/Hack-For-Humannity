const express = require('express'); //imports express
const path = require('path'); //imports path module used to connect server.js to the loginPage.html
const app = express();
const port = 3000;
const {EventEmitter} = require('events'); //imports events from eventEmitter
const {readFile} = require('fs').promises; //imports the readFile module as an ES module instead of a commons js module
const pageRoutes = require('./routes/pageRoutes'); //Imports routes  . = path relative to this file. .js is assumed by default since it is a module


app.use(express.urlencoded({ extended: true })); // Middleware to parse application/x-www-form-urlencoded
app.use(express.json()); // Middleware to parse JSON bodies such as the login request
app.use(express.static(path.join(__dirname, '..', 'client'))); // Serves static files from the 'client' directory
app.use('/', pageRoutes); // Use the routes with Express. This will handle all the page redirects

// Start the server
app.listen(port, () => 
{
     console.log(`Server running at http://localhost:${port}`);
});

