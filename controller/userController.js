//contain instance of user model  
var userModel = require('../models/users'); 



module.exports = function (app) {


var usersController = {
    // router.get("/user", checkAuthenticated, (req, res) => {
    //     res.render('./views/user', { name: req.user.name });
    // });

    app.get("/users", (req, res) => {
        res.json(users);
    });


    // We use the bcrypt to hash and salt our password
    // by adding a asynchronis libary by using a asynchronis function
    // and then we use a try and catch.
    // Async is needed since bcrypt is an asynchronis libary.
    app.post("/users", async (req, res) => {
        console.log("Hej");
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



    ////////////////////////////////////////////
    /////   REGISTER/LOGIN GET REQUESTS    /////
    ////////////////////////////////////////////
    app.get("/register", checkNotAuthenticated, (req, res) => {
        res.render('/views/register');
    });

    app.post('/register', checkNotAuthenticated, async (req, res) => {
        try {
            // By adding rounds to the function we make the hash more secure.
            // The higher the rounds, the more secure but also more time demanding 
            // At 10 we can generate af few hashes per second - at 20 or 30 it will take a few days to make one hash.
            // We are setting rounds to default.
            // Bcrypt both hashes the password and generates the salt at the same time.
            
            // const salt = await bcrypt.genSalt();
            
            // Create hashed password by using our typed in password.
            // Afterward we append the salt we want to the password.
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            
            // Console.log for testing the bcrypt hash and salt
            // console.log(salt);
            // console.log(hashedPassword);
            // users.push({
            //     id: Date.now().toString(),
            //     name: req.body.name,
            //     email: req.body.email,
            //     password: hashedPassword
            // });

            localStorage.setItem('id', Date.now().toString()) ;
            localStorage.setItem('name', req.body.name);
            localStorage.setItem('email', req.body.email);
            localStorage.setItem('password', hashedPassword);


            res.redirect('/login');
            // Use the hash function to hash the password
            //Then we use the salt to store with the password further secure it
        } catch {
            // If something goes wrong, send status 500 and return nothing
            res.redirect('/register');
        }
        console.log(users); 
    });

    // Get post from '/login' and check if user is authenticated with 'checkNotAuthenticated' function.
    app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/user',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get("/login", checkNotAuthenticated, (req, res) => {
        res.render('login.ejs');
    });

    // Log user out
    app.delete('/logout', (req, res) => {
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

}