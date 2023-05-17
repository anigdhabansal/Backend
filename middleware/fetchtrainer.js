const jwt = require('jsonwebtoken');
const JWT_SECRET = "Abhiisgood$hi"
const fetchtrainer = (req, res, next) => { // get the user from jwt token and add id to req object
    const token = req.header('auth-token');
    if (! token) {
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.trainerId = data.trainer.id
        next();

    } catch (error) {
        res.status(401).send({error: "please authenticate using a valid token"})
    }

}
module.exports = fetchtrainer;
