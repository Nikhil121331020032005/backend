const { z } = require("zod");

const signupSchema = z.object({
  username: z
    .string({ required_error: "please enter username" })
    .trim()
    .min(4, { message: "username must be greater than 4 letters" })
    .max(20, { message: "username shouldn't be greater than 20 letters" }),

  email: z
    .string({ required_error: "email is required" })
    .trim()
    .email({ message: "invalid email address" }),

  password: z
    .string({ required_error: "please enter a password" })
    .trim()
    .min(4, { message: "password must be at least 4 characters long" })
    .max(20, { message: "password shouldn't be longer than 20 characters" }),
});

module.exports = signupSchema;