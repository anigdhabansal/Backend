// const express = require('express');
// const router = express.Router()
// const fetchuser = require('../middleware/fetchuser');
// const Faq = require('../models/Faq')
// const {body, validationResult} = require('express-validator');


// // Route 1 get all the Faqs using :GET "api/Faqs/fetchallFaqs" Login required

// router.get('/fetchallFaqs', fetchuser, async (req, res) => {
//     try {
//         const Faqs = await Faq.find({user: req.Trainee.id});
//         res.json(Faqs)

//     } catch (error) {
//         console.error(error.message)
//         res.status(500).send("Internal Server Error")
//     }
// })


// // Route 2 Add a new Faq using POST " api/Faqs/addFaq" .Login Required
// router.post('/addFaq', fetchuser, [
//     body('title', 'Title mut be 3 character long').isLength(
//         {min: 3}
//     ),
//     body('description', 'Description mut be  10 character long').isLength(
//         {min: 10}
//     )
// ], async (req, res) => {

//     try {
//         const {title, description, tag} = req.body
//         const errors = validationResult(req);
//         if (! errors.isEmpty()) {
//             return res.status(400).json({errors: errors.array()});
//         }
//         const Faq = new Faq({title, description, tag, user: req.Trainee.id})
//         const savedFaq = await Faq.save()

//         res.json(savedFaq)

//     } catch (error) {
//         console.error(error.message)
//         res.status(500).send("Internal Server Error")
//     }
// })

// // Route 3 Update a  Faq using PUT " api/Faqs/updateFaq" .Login Required
// router.put('/updateFaq/:id', fetchuser, async (req, res) => {

//     const {title, description, tag} = req.body
//     try { // create newFaq obj
//         const newFaq = {};
//         if (title) {
//             newFaq.title = title
//         }
//         if (description) {
//             newFaq.description = description
//         }
//         if (tag) {
//             newFaq.tag = tag
//         };


//         // find theFaq to be updated and update it.
//         // param id is :id
//         let Faq = await Faq.findById(req.params.id);
//         if (! Faq) {
//             res.status(404).send("Not Found")
//         }

//         if (Faq.Trainee.toString() != req.Trainee.id) {
//             return res.status(401).send("Not Allowed")
//         }
//         Faq = await Faq.findByIdAndUpdate(req.params.id, {
//             $set: newFaq
//         }, {new: true})
//         res.json({Faq});
//     } catch (error) {
//         console.error(error.message)
//         res.status(500).send("Internal Server Error")
//     }

// })


// // Route 4 Delate a  Faq using DELETE " api/Faqs/deleteFaq" .Login Required
// router.delete('/deleteFaq/:id', fetchuser, async (req, res) => {

//     try {
//         // find theFaq to be updated and update it.
//         // param id is :id
//         let Faq = await Faq.findById(req.params.id);
//         if (! Faq) {
//             res.status(404).send("Not Found")
//         }

//         if (Faq.Trainee.toString() != req.Trainee.id) {
//             return res.status(401).send("Not Allowed")
//         }
//         Faq = await Faq.findByIdAndDelete(req.params.id);
//         res.json({"Success ": "Faq has been deleted", Faq: Faq});
//     } catch (error) {
//         console.error(error.message)
//         res.status(500).send("Internal Server Error")
//     }

// })


// module.exports = router;
