if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); 
}

const express       = require("express");
const bodyParser    = require('body-parser');
const path          = require('path');
const ejs           = require("ejs");
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const flash         = require("express-flash");
const session       = require("express-session"); 
const userRoutes    = require('./routes/userRoutes');

// Initiate Express
const app           = express();
// Set the port number
const PORT = 3000;


// Allow application to accept JSON
app.use(bodyParser.json());
// Tell application to be able access form inputs inside request variables inside of POST methods.
app.use(bodyParser.urlencoded({ extended: false }));

//setting the path of our views folder  
app.set("views",path.resolve(__dirname,'views')); 
// Set the view engine and load the 'ejs' template engine module in the app
app.set("view engine", "ejs");


app.use(flash());
app.use(session({
    // Takes a key (secret) which is kept secret in the .env-file
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false    
}));
app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
    res.render('index');
});

// Import '/routes/userRoutes.js'
app.use(userRoutes);

// Listen for the port, and display everything is working on the console
app.listen(PORT, () => console.log(`Server started on port: ${PORT}.`))

module.exports = app;