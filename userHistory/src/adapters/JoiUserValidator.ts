import { User } from '@/core/User';
import { Result, IUserValidator } from "@/core/ports/UserValidator";

import joi from 'joi'


class JoiUserValidator implements IUserValidator {
    private userSchema: joi.AnySchema

    constructor() {
        const userSchema = joi.object({
            id: joi.number(),
            email: joi.string()
                .email(),
            password: joi.string()
                .pattern(/^[a-zA-Z0-9]{3,30}$/),
            lastName: joi.string()
                .min(3)
                .max(15)
                .required()
                .pattern(/^[a-zA-Z]*$/),
            firstName: joi.string()
                .min(3)
                .max(15)
                .required()
                .pattern(/^[a-zA-Z]*$/),
            middleName: joi.string()
                .min(3)
                .max(15)
                .pattern(/^[a-zA-Z]*$/),
        })
        this.userSchema = userSchema
    }

    validate(u: User): Result {
        const { error, value } = this.userSchema.validate(u)
        const result: Result = {
            errorMessage: error?.details[0].message,
            user: value as User,
        }
        return  result
    }
}


export { JoiUserValidator }
