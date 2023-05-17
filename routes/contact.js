const express = require('express');
const router = express.Router();
const Contact = require("../models/Contact");

router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject,description } = req.body;
    const contact = new Contact({ name, email, subject,description });
    await contact.save();
    res.json({ message: 'Contact form submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;