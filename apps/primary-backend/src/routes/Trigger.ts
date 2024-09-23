import { Router } from "express";
import { client } from "..";

export const triggerRouter=Router();

triggerRouter.get("/available",async (req,res)=>{
    const availableTriggers=await client.availableTrigger.findMany();
    res.json({availableTriggers});
})