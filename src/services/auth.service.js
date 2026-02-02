const bcrypt = require("bcryptjs");
const logger = require("../config/logger");
const { db } = require("../config/database");
const User = require("../models/user.model");
const { eq } = require("drizzle-orm");



const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        logger.error("Error hashing password", error);
        throw error;
    }
}

const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        logger.error("Error comparing password", error);
        throw error;
    }
}


const createUser = async ({ name, email, password, role = "user" }) => {
    try {
        const existingUser = await db.select().from(User).where(eq(User.email, email)).limit(1);
        if (existingUser.length > 0) {
            throw new Error("User with this email already exits");
        }
        const hashedPassword = await hashPassword(password);
        const [newUser] = await db.insert(User).values({ name, email, password: hashedPassword, role }).returning({ id: User.id, name: User.name, email: User.email, role: User.role, createdAt: User.createdAt, updatedAt: User.updatedAt });
        // return newUser;

        logger.info(`User created successfully ${newUser.email}`);
        return newUser;
    } catch (error) {
        logger.error("Error creating user", error);
        throw error;
    }
}

module.exports = {
    comparePassword,
    hashPassword,
    createUser
};