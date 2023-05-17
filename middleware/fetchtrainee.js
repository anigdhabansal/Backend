
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Abhiisgood$hi"

const fetchtrainee = (req, res, next) => { 
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.traineeId = data.trainee.id;
        next();

    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

module.exports = fetchtrainee;
