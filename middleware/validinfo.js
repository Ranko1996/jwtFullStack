module.exports = (req, res, next) => {
    const {email, name, password} = req.body
    
    function validEmail (userEmail) {
        //regex f-ja nađena na google
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    if(req.path === "/register"){
        //Tražimo falsy values od email, name i pass zato što every vraće true ako su null values
        if(![email, name, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials")
        } else if(!validEmail(email)){
            return res.status(401).json("Invalid Email")
        }
    } else if(req.path === "/login") {
        if(![email, password].every){
            return res.stauts(401).json("Missing Credentials")
        } else if(!validEmail(email)){
            return res.status(401).json("Invalid Email")
        }
    } 

    next();
}