const express = require('express');
const router = express.Router()
const fetchtrainee = require('../middleware/fetchtrainee');
const Review = require('../models/Review')
const {body, validationResult} = require('express-validator');


// // Route 1 get all the notes using :GET "api/notes/fetchallnotes" Login required

// router.get('/fetchallnotes', fetchuser, async (req, res) => {
//     try {
//         const notes = await Note.find({user: req.Trainee.id});
//         res.json(notes)

//     } catch (error) {
//         console.error(error.message)
//         res.status(500).send("Internal Server Error")
//     }
// })


// Route 2 Add a new Note using POST " api/notes/addnote" .Login Required
router.post('/addreview', fetchtrainee, [
    body('title', 'Title mut be 3 character long').isLength(
        {min: 3}
    ),
    body('description', 'Description mut be  10 character long').isLength(
        {min: 10}
    )
], async (req, res) => {

    try {
        const {title, description, tag} = req.body
        const errors = validationResult(req);
        if (! errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const review = new Review({title, description, tag, trainee: req.trainee.id})
        const savedReview = await review.save()

        res.json(savedReview)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// // Route 3 Update a  Note using PUT " api/notes/updatenote" .Login Required
// router.put('/updatenote/:id', fetchuser, async (req, res) => {

//     const {title, description, tag} = req.body
//     try { // create newNote obj
//         const newNote = {};
//         if (title) {
//             newNote.title = title
//         }
//         if (description) {
//             newNote.description = description
//         }
//         if (tag) {
//             newNote.tag = tag
//         };


//         // find thenote to be updated and update it.
//         // param id is :id
//         let note = await Note.findById(req.params.id);
//         if (! note) {
//             res.status(404).send("Not Found")
//         }

//         if (note.Trainee.toString() != req.Trainee.id) {
//             return res.status(401).send("Not Allowed")
//         }
//         note = await Note.findByIdAndUpdate(req.params.id, {
//             $set: newNote
//         }, {new: true})
//         res.json({note});
//     } catch (error) {
//         console.error(error.message)
//         res.status(500).send("Internal Server Error")
//     }

// })


// // Route 4 Delate a  Note using DELETE " api/notes/deletenote" .Login Required
// router.delete('/deletenote/:id', fetchuser, async (req, res) => {

//     try {
//         // find thenote to be updated and update it.
//         // param id is :id
//         let note = await Note.findById(req.params.id);
//         if (! note) {
//             res.status(404).send("Not Found")
//         }

//         if (note.Trainee.toString() != req.Trainee.id) {
//             return res.status(401).send("Not Allowed")
//         }
//         note = await Note.findByIdAndDelete(req.params.id);
//         res.json({"Success ": "Note has been deleted", note: note});
//     } catch (error) {
//         console.error(error.message)
//         res.status(500).send("Internal Server Error")
//     }

// })


module.exports = router;
