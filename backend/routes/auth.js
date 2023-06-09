// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// var jwt = require("jsonwebtoken");
// const fetchuser = require("../middleware/fetchuser");

// const JWR_SECRET = "Divyesh_is_goodboy$";
// // Route one1:  create user using post /api/auth/createuser api no login req
// router.post(
//   "/createuser",
//   [
//     // validation of users info
//     body("name", "enter valid name").isLength({ min: 3 }),
//     body("email", "enter valid email").isEmail(),
//     body("password", "enter valid password").isLength({ min: 5 }),
//   ],
//   async (req, res) => {
//     // console.log(req.body);
//     // req and res sending and checking error
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//       //   checking is user with email exist or not
//       let user = await User.findOne({ email: req.body.email });
//       // console.log(user);
//       if (user) {
//         return res
//           .status(400)
//           .json({ error: "Sorry a user with this mail already exists " });
//       }

//       // salting and hashing of password
//       const salt = await bcrypt.genSalt(10);
//       const secPass = await bcrypt.hash(req.body.password, salt);
//       // creating user
//       user = await User.create({
//         name: req.body.name,
//         password: secPass,
//         email: req.body.email,
//       });

//       // .then(user=>res.json(user))
//       //   .catch(err=> {console.log(err)
//       //   res.json({
//       //     error: 'please eneter unique value of email',
//       //     message: err.message
//       //   })

//       //  Following for authorization of user
//       const data = {
//         user: {
//           id: user.id,
//         },
//       };
//       // giving user authorisation token
//       const authToken = jwt.sign(data, JWR_SECRET);
//       // console.log(jwtData);

//       // res.json(user);
//       res.json(authToken);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).send("Internal Server Error");
//       }
//   }
// );

// //Route 2 : authenticate user using Pot "api/auth/login" no login required

// router.post(
//   "/login",
//   [
//     // validation of users info

//     body("email", "enter valid email").isEmail(),
//     body("password", "passwword can not be blank").exists(),
//   ],
//   async (req, res) => {
//     // console.log(req.body);
//     // req and res sending and checking error
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const {email,password} =req.body;
//     try {
//       //   checking is user with email exist or not
//       let user = await User.findOne({email});
//       // console.log(user); 
//       if (!user) {
//         return res
//           .status(400)
//           .json({ error: "Please try to login with correct credential " });
//       }

//       const passwordComapare =await bcrypt.compare(password ,user.password);
//       if (!passwordComapare) {
//         return res
//           .status(400)
//           .json({ error: "Please try to login with correct credential " });

//       }

//       //  Following for authorization of user
//       const data = {
//         user: {
//           id: user.id,
//         },
//       };
//       // giving user authorisation token
//       const authToken = jwt.sign(data, JWR_SECRET);
//       // console.log(jwtData);

//       // res.json(user);
//       res.json({authToken});
//     } catch (error) {
//       console.log(error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );


// // Route 3: Get the logged in user detail login required 

// router.post('/getuser',fetchuser,
//   async (req,res)=>{

//     try {
//       const userId= req.user.id;
//       const user =await User.findById(userId).select("-password");
//       res.send(user);
//     } catch (error) {
//       console.log(error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// )

// module.exports = router;



const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Harryisagoodb$oy';

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);


    // res.json(user)
    res.json({ authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }


});


// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router