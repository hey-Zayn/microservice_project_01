const { z } = require('zod');

exports.signUpSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters long").max(255, "Name must be at most 255 characters long"),
    email: z.string().trim().email("Invalid email address").toLowerCase().max(255, "Email must be at most 255 characters long"),
    password: z.string().trim().min(6, "Password must be at least 6 characters long").max(255, "Password must be at most 255 characters long"),
    role: z.enum(["user", "admin"]).default("user"),

});

exports.signInSchema = z.object({
    email: z.string().trim().email("Invalid email address").toLowerCase().max(255, "Email must be at most 255 characters long"),
    password: z.string().trim().min(6, "Password must be at least 6 characters long").max(255, "Password must be at most 255 characters long"),
});

