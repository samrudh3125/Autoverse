import express from 'express';
const app=express();
import { PrismaClient } from '@repo/db';

const client=new PrismaClient();
app.post("/hooks/catch/:userId/:zapId",async(req,res)=>{
    const {userId,zapId}=req.params;
    const body=req.body;
    console.log(body);

    await client.$transaction(async tx=>{
        const run=await tx.zapRun.create({
            data:{
                zapId:zapId,
                metadata:{}
            }
        })
        await tx.zapRunOutbox.create({
            data:{
                zapRunId:run.id
            }
        })
    })

    res.json({message:"Success"})
})

app.listen(3002,()=>{
    console.log("Server is running on port 3002");
})