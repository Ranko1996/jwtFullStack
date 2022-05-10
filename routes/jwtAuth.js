//Da bi route bile moodularne koristimo router
const router = require('express').Router()
const pool = require("../db")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator")
const validInfo = require("../middleware/validinfo")
const authorization = require("../middleware/authorization")

//registracija 

router.post("/register", validInfo, async(req, res) => {
    try {
        
        //1. destrukturiranje podataka email, ime i lozinka
        const{ name, email, password} = req.body;
        
        //2. provjera da li korisnik već postoji(ako ne postoji vrati error)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        if(user.rows.length > 0){
            return res.status(401).json("User already exist");
        }

        //3. Bcryptiranje korisnikove lozinke 
        //npm bcrypt web stranica za docs
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds)

        const bcryptPassword = await bcrypt.hash(password, salt) 

        //4. Unos korisnika u db
        let newUser = await pool.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword]
        )


        //5. Generiranje jwt tokena
        const token = jwtGenerator(newUser.rows[0].user_id);
        return res.json({ token })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }
})

router.post('/login', validInfo, async(req, res) => {
    try {
        
        //1. destrukturiranje req.body
        const{email, password} = req.body;

        //2. dal user postoji ako ne izbaci error
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email])
        if(user.rows.length === 0){
            return res.status(401).json("Password or email is incorrect")
        }

        //3. ako postoji, da li se lozinka podudara s onom u bazi podatka
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        
        if(!validPassword) {
            return res.status(401).json("Password or email incorrect")
        }
        
        //4. ako je sve uredu, dodaj useru jwt token
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({token})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }
})

router.get('/is-verify', authorization, async(req, res) => {
    try {
        
        res.json(true)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }
})

module.exports = router;