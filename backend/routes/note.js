const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Route 1 : Get All the notes using : GET "/api/auth/getuser" Login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2 : Add the new note using : POST "/api/auth/addnote" Login required
router.post(
  "/addnote",
  fetchuser,
  [
    // validation of users info
    body("title", "enter valid title").isLength({ min: 3 }),

    body("description", "enter valid Description(must lenght 5").isLength({
      min: 5,
    }),
  ],

  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // if there is serror return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //     creating new note
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3 : Add the Updated note using : PUT "/api/auth/updatenote/:id" Login required
 router.put('/updatenote/:id' ,fetchuser, async (req,res)=>{
    const {title,description,tag} =req.body;
    // create new empty note
    const newNote = {};

    if(title){newNote.title=title;}
    if(description){newNote.description=description;}
    if(tag){newNote.tag=tag;}


    // find note to be updated and update it
    let note= await Note.findById(req.params.id);
    if(!note){return res.status(401).send("Not found")};
    if(note.user.toString()!= req.user.id){
        return res.status(401).send("Not authorized");
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
    res.json({note});
 })

module.exports = router;
