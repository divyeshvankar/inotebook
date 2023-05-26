const express =require ('express');
const router = express.Router();
const User = require ('../models/User');
const {body , validationResult}=require ('express-validator');


router.post('/',[
    // validation of users info
    body('name','enter valid name').isLength({min:3}),
    body('email','enter valid email').isEmail(),
    body('password','enter valid password').isLength({min:5})

],async (req,res)=>{
    // console.log(req.body);
// req and res sending and checking error
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
try{


//   checking is user with email exist or not
let user= await User.findOne({email: req.body.email});;
// console.log(user);
if(user){
    return res.status(400).json({error:"Sorry a user with this mail already exists "})
}
// creating user 
user = await User.create({
    name: req.body.name,
    password: req.body.password,
    email:req.body.email,
})

// .then(user=>res.json(user))
//   .catch(err=> {console.log(err)
//   res.json({
//     error: 'please eneter unique value of email',
//     message: err.message
//   })
res.json(user);
} catch (error){
    console.log(error.message);
    res.status(500).send("Some error occures");
}

})


module.exports = router

