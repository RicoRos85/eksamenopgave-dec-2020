const express        = require('express'); 
const passport       = require("passport");
const fs             = require("fs");
const userController = require('../controller/userController');
//const jsonFile       = require("../userData.json");
// Create new Express Router instance
const router         = express.Router();



//let rawdata = fs.readFileSync('userData.json');
//let student = JSON.parse(rawdata);
//console.log(student);


// const users = [
//     {
//         id: "123",
//         username: "Rico Rosenkrans",
//         email: "rico@mail.dk",
//         password: "1234"
//     },
//     {
//         id: "124",
//         username: "Malika Rosenkrans",
//         email: "malika@mail.dk",
//         password: "1234"
//     },
//     {
//         id: "125",
//         username: "Milo Rosenkrans",
//         email: "mico@mail.dk",
//         password: "1234"
//     }
// ];

router.get('/users/all',  (req, res) => {
    res.body.name = "Rico";
    userController.createUser(req.body.name)
});


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
    console.log(req.body.email);
    JSON.stringify(jsonFile);
    for(var key in jsonFile) {
        console.log("key:"+key+", value:"+ JSON.stringify(jsonFile[key]));
    }
    //const user = users.find(user => user.name === req.body.name);
   
    // If the user does not exists
    // if(user == null) {
    //     // Return error message.
    //     return res.status(400).send('Cannot find user');
    // }
    // try {
    //     // Use bcrypt to compare user passwords.
    //     // If password is the same then allow.
    //     if (await bcrypt.compare(req.body.password, user.password)) {
    //         res.send('Alt OK');
    //     } else {
    //         res.send('Ikke tilladt');
    //     }
    // } catch {
    //     // Send 500 error.
    //     res.status(500).send()
    // }
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


router.post('/user/register',  (req, res) => {
    if(req.body != null) {

        let userId   = Date.now().toString();
        let userName = req.body.name;
        let email    = req.body.email;
        let password = req.body.password;


        let user = {
            table: []
        };
         

        fs.readFile('userData.json', (err, data) => {
            if (err){
                console.log(err);
            } else {
                user = JSON.parse(data); //now it an object
                user.forEach(u => {
                    console.log(u['email']);
                    if(u['email'] == email) {
                        console.log("Der eksisterer allerede en bruger med denne email.");
                        //res.send('Der eksisterer allerede en bruger med denne email.');
                   
                    } else {
                        user.push(
                            {
                                id: userId,
                                name: userName,
                                email: email,
                                password: password
                            }
                        ); 
                        userToJSON = JSON.stringify(user, null, 2); //convert it back to json
                        fs.writeFile('userData.json', userToJSON, 'utf8', function(err){
                            if(err) throw err;
                        }); 
        
                        console.log("User has been registred!");
                        res.redirect('/user/login');
                    }
                });
                
             
            }
        });
    } else {
        res.redirect('/user/register');
        console.log("Error: could not register user!");
    }
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
