const express = require("express");
const ejs = require("ejs");
const PORT = 3000;
const app = express();
const bcrypt = require('bcrypt');


const users = [];

// Allow our application to accept JSON
app.use(express.json());

// Use the 'public' folder as main folder
app.use(express.static("public"));

/* Set the view engine so we don’t have to specify 
   the engine or load the 'ejs' template engine module 
   in the app - Express loads the module internally */
app.set("view engine", "ejs");

// Tell application to be able access form inputs inside 
// request variables inside of POST method.
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render('index');
});


////////////////////////////////////////////
/////////////////   USERS   ////////////////
////////////////////////////////////////////
app.get("/users", (req, res) => {
    res.json(users);
});

// We use the bcrypt to hash and salt our password
// by adding a asynchronis libary by using a asynchronis function
// and then we use a try and catch.
// Async is needed since bcrypt is an asynchronis libary.
app.post("/users", async (req, res) => {
    // First we make bcrypt generate a salt
    try {
        // By adding rounds to the function we make the hash more secure.
        // The higher the rounds, the more secure but also more time demanding 
        // At 10 we can generate af few hashes per second - at 20 or 30 it will take a few days to make one hash.
        // We are setting rounds to default.
        // Bcrypt both hashes the password and generates the salt at the same time.
        const salt = await bcrypt. genSalt();
        // Create hashed password by using our typed in password.
        // Afterward we append the salt we want to the password.
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Console.log for testing the bcrypt hash and salt
        // console.log(salt);
        // console.log(hashedPassword);
        const user = { 
            name: req.body.name,
            password: hashedPassword
        }
        users.push(user);
        res.status(201).send();
        // Use the hash function to hash the password
        //Then we use the salt to store with the password further secure it
    } catch {
        // If something goes wrong, send status 500 and return nothing
        res.status(500).send();
    }
});

// Async is needed since bcrypt is an asynchronis libary.
app.post("/users/login", async (req, res) => {
    // First find a partically user based on the name passed in.
    const user = users.find(user => user.name === req.body.name);
    // If the user does not exists
    if(user == null) {
        // Return error message.
        return res.status(400).send('Cannot find user');
    }
    try {
        // Use bcrypt to compare user passwords
        // If password is the same...
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Alt OK');
        } else {
            res.send('Ikke tilladt');
        }
    } catch {
        // Send 500 error.
        res.status(500).send()
    }
});



////////////////////////////////////////////
/////   REGISTER/LOGIN GET REQUESTS    /////
////////////////////////////////////////////
app.get("/register", (req, res) => {
    res.render('register');
});

app.get("/login", (req, res) => {
    res.render('login');
});



////////////////////////////////////////////
/////   REGISTER/LOGIN POST REQUESTS    ////
////////////////////////////////////////////
app.post('/register', async (req, res) => {
    try {
        // By adding rounds to the function we make the hash more secure.
        // The higher the rounds, the more secure but also more time demanding 
        // At 10 we can generate af few hashes per second - at 20 or 30 it will take a few days to make one hash.
        // We are setting rounds to default.
        // Bcrypt both hashes the password and generates the salt at the same time.
        const salt = await bcrypt. genSalt();
        // Create hashed password by using our typed in password.
        // Afterward we append the salt we want to the password.
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Console.log for testing the bcrypt hash and salt
        // console.log(salt);
        // console.log(hashedPassword);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login');
        // Use the hash function to hash the password
        //Then we use the salt to store with the password further secure it
    } catch {
        // If something goes wrong, send status 500 and return nothing
        res.redirect('/register');
    }
    console.log(users); 
});

app.post('/login', (req, res) => {

});


app.listen(PORT, () => console.log(`Server started on port: ${PORT}.`))