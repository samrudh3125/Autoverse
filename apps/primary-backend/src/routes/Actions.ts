import { Router } from "express";
import { client } from "..";

export const actionRouter=Router();

actionRouter.get("/available",async(req,res)=>{
    const availableActions=await client.availableAction.findMany();
    res.json({availableActions});
})