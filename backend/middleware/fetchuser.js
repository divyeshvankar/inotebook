var jwt = require("jsonwebtoken");
const JWR_SECRET = "Divyesh_is_goodboy$";

const fetchuser = (req,res,next) =>{
    // Get the user fromt jwt token and add id to req object
    const token =req.header('auth-token');
    if(!token){
        res.status(401).send({ error : "please authenticate using valid token"});

    }

    try {
        const data= jwt.verify(token,JWR_SECRET);
        req.user =data.user;

        next();
        
    } catch (error) {
        res.status(401).send({ error : "please authenticate using valid token"});
        
    }
}   


module.exports =fetchuser;