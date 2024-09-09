import Joi from "joi";

export const userSchema = Joi.object({
    name: Joi.string().required().max(30),
    email: Joi.string().min(5).max(100).required().lowercase(),
    password: Joi.string().min(8).required(),
    confirmpassword: Joi.string().min(8).required(),
})