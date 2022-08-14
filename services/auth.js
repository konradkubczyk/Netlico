const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = await req.headers.authorization.split(" ")[1];
        const decodedToken = await jwt.verify(token, process.env.JWT_PRIVATE_KEY); // [TODO]
        const user = await decodedToken; // [TODO]
        req.user = user; // [TODO]
        console.log(decodedToken); // [TODO]
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized, log in to access the resource',
            error: new Error("Invalid request")
        });
    }
}