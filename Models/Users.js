class User {
    constructor(name, email, password, age, gender, matchesArray) {
      this.name         = name;
      this.email        = email;
      this.password     = password;
      this.age          = age;
      this.gender       = gender;
      this.matchesArray = matchesArray;
    }  
}



function testLocalStorage() {
    localStorage.setItem('id', 'yessir');
    console.log("Det virker også!");
}


module.exports = User;