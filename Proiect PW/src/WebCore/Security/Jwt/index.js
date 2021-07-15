const jwt = require('jsonwebtoken');


const ServerError = require('../../../WebApp/Models/ServerError.js');

const options = {
    issuer: process.env.JWT_ISSUER,
    subject: process.env.JWT_SUBJECT,
    audience: process.env.JWT_AUDIENCE,
    expiresIn: '1200s'
};

const generateTokenAsync = async (payload) => {
     try {
        const token = await jwt.sign(JSON.parse(JSON.stringify(payload)), process.env.JWT_SECRET_KEY, options);
        return token;
    } catch (err) {
        console.trace(err);
        throw new ServerError("Eroare la decriptarea tokenului!", 400);
    }
};

const verifyAndDecodeDataAsync = async (token) => {
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, options);
        return decoded;
    } catch (err) {
        console.trace(err);
        throw new ServerError("Eroare la decriptarea tokenului!", 400);
    }
};

module.exports = {
    generateTokenAsync,
    verifyAndDecodeDataAsync
};