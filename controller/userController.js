const User       = require('../models/users.js');

const users_index = (req, res) => {
    const posts = [
        {
            username: "Rico",
            title: "Post"
        },
        {
            username: "Milo",
            title: "Post 2"
        }
    ]
}



function createUser(req) {
    new User (req);
}

function updateUser() {

}

function deleteUSer() {

}

function testLocalStorage() {
    localStorage.setItem('id', 'yessir');
    console.log("Det virker også!");
}


module.exports = {
    createUser
}