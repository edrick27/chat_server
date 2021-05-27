const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {

    const token = req.header('x-token');

    console.log(token);

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'no hay token en la peticion'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.JWT_KEY);
        req.uid = uid;

        next();
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'token no valido!'
        });
    }
}

module.exports = validateJWT;