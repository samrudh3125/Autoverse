import express from 'express';
import { SigninSchema, SignupSchema } from '../types';
import { client } from '..';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware";

const UserRouter= express.Router();

UserRouter.post("/signup",async(req,res)=>{
    const body=req.body;
    const parsed=SignupSchema.safeParse(body);

    if(!parsed.success){
        res.status(411).json(parsed.error);
        return;
    }

    const userExists=await client.user.findFirst({
        where:{
            email:parsed.data.email
        }
    });

    if(userExists){
        res.status(409).json({error:"User already exists"});
        return;
    }

    const password=await bcrypt.hash(parsed.data.password,10);

    await client.user.create({
        data:{
            email:parsed.data.email,
            password:password,
            name:parsed.data.name,
        }
    })

    //TODO await sendEmail()

    return res.json({
        message:"Please check your email to verify your account"
    })
})

UserRouter.post("/signin",async(req,res)=>{
    const body=req.body;
    console.log(body);
    const parsed=SigninSchema.safeParse(body);

    if(!parsed.success){
        res.status(411).json(parsed.error);
        console.log("error");
        return;
    }

    const password=await bcrypt.hash(parsed.data.password,10);

    const user=await client.user.findFirst({
        where:{
            email:parsed.data.email,
            password:parsed.data.password
        }
    });

    if(!user){
        res.status(401).json({error:"Invalid credentials"});
        return;
    }

    const token=jwt.sign({id:user.id}, process.env.JWT_SECRET || "Secret");

    return res.json({
        token:token
    })
})

UserRouter.get("/user",authMiddleware,async(req,res)=>{
    const user=await client.user.findFirst({
        where:{
            //@ts-ignore
            id:req.id
        },
        select:{
            email:true,
            name:true
        }
    });

    return res.json(user);
})

export default UserRouter;