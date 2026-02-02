const jwt = require('jsonwebtoken');
const logger = require("../config/logger");



const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_TOKEN_EXPIRY = "1d";
const JWT_REFRESH_TOKEN_EXPIRY = "7d";


const jwttoken = {
    sign: (payload) => {
        try {
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRY });
        } catch (error) {
            logger.error("Error signing token", error);
            throw error;
        }
    },
    verify: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            logger.error("Error verifying token", error);
            throw error;
        }
    },
    decode: (token) => {
        try {
            return jwt.decode(token);
        } catch (error) {
            logger.error("Error decoding token", error);
            throw error;
        }
    }
}


const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRY });
};

module.exports = {
    jwttoken,
    generateAccessToken,
    generateRefreshToken
};