const express   = require('express'); 
const passport  = require("passport");
const bodyParser    = require('body-parser');
// Create new Express Router instance
const router    = express.Router();


const users = [
    {
        id: "123",
        username: "Rico Rosenkrans",
        email: "rico@mail.dk",
        password: "1234"
    },
    {
        id: "124",
        username: "Malika Rosenkrans",
        email: "malika@mail.dk",
        password: "1234"
    },
    {
        id: "125",
        username: "Milo Rosenkrans",
        email: "mico@mail.dk",
        password: "1234"
    }
];


// Passport - Function for finding the User based on the email
// const initializePassport = require('../passport-config');
// initializePassport(
//     passport, 
//     // Find where email = users.find( Find where user = user.email ) 
//     email => users.find(user => user.email === email),
//     id    => users.find(user => user.id    === id)
// );

// Get user
router.get("/user", checkAuthenticated, (req, res) => {
    res.render('user', { name: req.user.name });
});

// Get all users
router.get("/user/all", (req, res) => {
    res.json(users);
});


// Async is needed since bcrypt is an asynchronis libary.
router.post("/user/login", async (req, res) => {
    
    // First find a partically user based on the name passed in.
    const user = users.find(user => user.name === req.body.name);
   
    // If the user does not exists
    if(user == null) {
        // Return error message.
        return res.status(400).send('Cannot find user');
    }
    try {
        // Use bcrypt to compare user passwords.
        // If password is the same then allow.
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




// Get post from '/login' and check if user is authenticated with 'checkNotAuthenticated' function.
router.post('/user/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/user/login',
    failureFlash: true
}));

router.get("/user/login", checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});



router.get("/user/register", checkNotAuthenticated, (req, res) => {
    res.render('register');
});

router.post('/user/register', async (req, res) => {
    if(req.body != null) {

        let userId   = Date.now().toString;
        let userName = req.body.name;
        // By adding rounds to the function we make the hash more secure.
        // The higher the rounds, the more secure but also more time demanding 
        // At 10 we can generate af few hashes per second - at 20 or 30 it will take a few days to make one hash.
        // We are setting rounds to default.
        // Bcrypt both hashes the password and generates the salt at the same time.
        
        // const salt = await bcrypt.genSalt();
        
        // Create hashed password by using our typed in password.
        // Afterward we append the salt we want to the password.
        //const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let user = {
            id: userId,
            name: userName,
            email: req.body.email,
            password: req.body.password
        }

        

        //console.log(document.getElementById('inputName').value);

        // let user = {
        //     id: Date.now(),
        //     name: document.getElementById('inputName').value,
        //     email: document.getElementById('inputEmail').value,
        //     password: document.getElementById('inputPassword').value
        // }

        users.push(user);


        localStorage.setItem('username', JSON.stringify(userName));

        // if(users.push(JSON.parse(localStorage.getItem('session')))) {
        //     console.log("LocalStorage virker!");
        // } else {
        //     console.log("LocalStorage virker IKKE!");
            
        // };

        // localStorage.setItem('id', Date.now().toString()) ;
        // localStorage.setItem('name', req.body.name);
        // localStorage.setItem('email', req.body.email);
        // localStorage.setItem('password', hashedPassword);

        res.redirect('/user/login');
        console.log("User has been registred!");
        // Use the hash function to hash the password
        //Then we use the salt to store with the password further secure it
    } else {
        // If something goes wrong, send status 500 and return nothing
        res.redirect('/user/register');
        console.log("Error: could not register user!");
    }
    console.log(users); 
});

// Log user out
router.delete('/logout', (req, res) => {
    // logOut is set up automatically by passport and clears session/log user out
    req.logOut();
    res.redirect('/login');
})



// Function to make sure certain routes are not available for NON-LOGGED IN user
function checkAuthenticated(req, res, next) {
    // Check if the User is authenticated
    if(req.isAuthenticated()) {
        return next();
    }

    // If return false
    res.redirect('/');
}

// Function to make sure certain routes are not available for LOGGED IN user
function checkNotAuthenticated(req, res, next) {
    // If user is logged in
    if(req.isAuthenticated()) {
        return res.redirect('/user');
    }
    next();
}


module.exports = router;
