const express = require('express');
const router = express.Router()
const fetchadmin = require('../middleware/fetchadmin');
const Faq = require('../models/Faq')
const {body, validationResult} = require('express-validator');


// Route 1 get all the Faqs using :GET "api/Faqs/fetchallFaqs" Login required

router.get('/fetchfaq', fetchadmin, async (req, res) => {
    try {
        const faq = await Faq.find({admin:req.admin.id});
        res.json(faq)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// Route 1 get all the faq using :GET "api/faq/fetchallfaq" Login required

router.get('/fetchallfaq',  async (req, res) => {
    try {
        const faq = await Faq.find({});
        res.json(faq)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// Route 2 Add a new Faq using POST " api/Faqs/addFaq" .Login Required
router.post('/addfaq', fetchadmin, [
    body('question', 'Title mut be 3 character long').isLength(
        {min: 3}
    ),
    body('answer', 'answer mut be  10 character long').isLength(
        {min: 10}
    )
], async (req, res) => {

    try {
        const {question, answer, tag} = req.body
        const errors = validationResult(req);
        if (! errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const faq = new Faq({question, answer, tag, admin: req.admin.id})
        const savedFaq = await faq.save()

        res.json({message: "Faq is added."})

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// Route 3 Update a  Faq using PUT " api/Faqs/updateFaq" .Login Required
// router.put('/updatefaq/:id', fetchadmin, async (req, res) => {

//     const {question, answer, tag} = req.body
//     try { // create newFaq obj
//         const newFaq= {};
//         if (question) {
//             newFaq.question = question
//         }
//         if (answer) {
//             newFaq.answer = answer
//         }
//         if (tag) {
//             newFaq.tag = tag
//         };


//         // find theFaq to be updated and update it.
//         // param id is :id
//         let Faq = await Faq.findById(req.params.id);
//         console.log(Faq)
//         if (! Faq) {
//             res.status(404).send("Not Found")
//         }

//         if (Faq.Admin.toString() != req.Admin.id) {
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


module.exports = router;
