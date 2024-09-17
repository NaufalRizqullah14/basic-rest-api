import { NextFunction, Request, Response } from "express"
import joi, { required } from "joi"

/** create a for and rule/schema
 * for add new medicine*/
const createscheme = joi.object({
    name:joi.string().required(),
    stock:joi.number().required(),
    price:joi.number().required(),
    exp_date:joi.date().required(),
    type: joi.string()
    .valid("Syrup", "Tablet", "Powder")
    .required()
})

const createValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validate = createscheme.validate(req.body)
    if (validate.error){
        return res.status(400)
        .json({
            massage: validate
            .error
            .details
            .map(it => it.message)
            .join
        })
    }
    next()
}

export { createValidation }