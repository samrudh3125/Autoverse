import {z} from "zod";

export const SignupSchema=z.object({
    email:z.string().email(),
    password:z.string().min(8),
    name:z.string()
})

export const SigninSchema=z.object({
    email:z.string().email(),
    password:z.string().min(8)
})

export const ZapCreateSchema=z.object({
    availaibleTriggersId:z.string().min(1),
    triggerMetadata:z.any().optional(),
    actions:z.array(z.object({
        availableActionId:z.string().min(1),
        actionMetadata:z.any().optional()
     }))
})