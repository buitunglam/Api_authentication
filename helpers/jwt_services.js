const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');

const signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const option = {
            expiresIn: '1h' // 1m 1s
        }

        jwt.sign(payload, secret, option, (err, token) => {
            if(err) reject(err);
            resolve(token)
        });
    })
};

const verifyAccessToken = (req, res, next) => {
    if(!req.headers['authorization']){
        return next(createHttpError.Unauthorized());
    }
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err){
            return next(createHttpError.Unauthorized());
        }
        req.payload = payload;
        console.log('payload..', payload);
        next();
    })
}

module.exports = {
    signAccessToken,
    verifyAccessToken
}