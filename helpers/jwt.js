const jwt = require("jsonwebtoken");

const generateJWT = (uid) => {

    return new Promise((resolve, reject) => {
        
        const payload = { uid };

        jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '48h'
        }, (err, token) => {

            if (err) {
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
}

const checkJWT = ( token = '' ) => {

    try {

        const { uid } = jwt.verify( token, process.env.JWT_KEY);
        return [true, uid];

    } catch (error) {

        return [false, null];
    }
}

module.exports = {
    generateJWT,
    checkJWT
}