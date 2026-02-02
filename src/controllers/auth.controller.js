const logger = require("../config/logger");
const User = require("../models/user.model");
const validate = require("../validations/auth.validation");
const { formatValidationErrors } = require("../utils/format");
const { createUser } = require("../services/auth.service");
const { jwttoken } = require("../utils/jwt");
const cookies = require("../utils/cookies");

exports.signUp = async (req, res, next) => {
    try {
        const validated = validate.signUpSchema.safeParse(req.body);
        if (!validated.success) {
            return res.status(400).json({ error: validated.error.issues, message: "Validation failed", details: formatValidationErrors(validated.error) });
        }
        const { name, email, password, role } = validated.data;

        // Auth Service
        logger.info("Creating user", { name, email, role });
        // const user = await User.create({ name, email, password, role });
        const newUser = await createUser({ name, email, password, role });
        const token = jwttoken.sign({ id: newUser.id, email: newUser.email, role: newUser.role });
        cookies.setCookie(res, "token", token);

        logger.info("User created successfully", {
            user: {
                id: newUser.id,
                name,
                email,
                role,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        });
        res.status(201).json({ message: "User created successfully", user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, token });
    } catch (error) {
        logger.error("Error signing up", error);
        if (error.message === "User with this email already exits") {
            return res.status(409).json({ error: "Email already exist" })
        }
        next(error);
    }
}