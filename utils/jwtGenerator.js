const jwt = require("jsonwebtoken")
require("dotenv").config()
//pristup enviroment varijablama

function jwtGenerator(user_id) {
    const payload = {
        user: user_id
    }
    //Prijava na 1 sat
    return jwt.sign(payload, process.env.jwtSecret, {expiresIn:"1hr"})
}

module.exports = jwtGenerator;