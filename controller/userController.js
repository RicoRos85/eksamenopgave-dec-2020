const User       = require('../models/users.js');

const users_index = (req, res) => {
    console.log("YEYESYES");
    localStorage.setItem('id',999999);
}

function testLocalStorage() {
    localStorage.setItem('id', 'yessir');
    console.log("Det virker også!");
}


module.exports = {
    users_index
}