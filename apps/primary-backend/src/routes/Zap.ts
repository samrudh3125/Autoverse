import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
import {client} from "..";

export const ZapRouter=Router();

ZapRouter.post("/",authMiddleware,async(req,res)=>{
    //@ts-ignore
    const id=req.id;
    const body=req.body;
    // const parsed=ZapCreateSchema.safeParse(body);

    // if(!parsed.success){
    //     console.log(parsed.error);
    //     res.status(411).json({
    //         message:"Incorrect inputs"
    //     });
    //     return;
    // }

    const zapId=await client.$transaction(async (tx:any)=>{
        const zap=await client.zap.create({
            data:{
                userId:id,
                triggerId:"",
                actions:{
                    createMany:{
                        data:body.actions.map((action:any,i:any)=>({
                            actionId:action.availableActionId,
                            sortingOrder:i,
                            metadata:action.metadata
                        }))
                    }
                }
            }
        })

        const trigger=await tx.trigger.create({
            data:{
                zapId:zap.id,
                triggerId:body.availableTriggersId,
            }
        })

        await tx.zap.update({
            where:{
                id:zap.id
            },
            data:{
                triggerId:trigger.id
            }
        })
    })

    return res.json({zapId});
})

ZapRouter.get("/",authMiddleware,async(req,res)=>{
    //@ts-ignore
    const id=req.id;
    const zaps=await client.zap.findMany({
        where:{
            userId:id
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
            }
        }
    }});

    return res.json({
        zaps
    });
})

ZapRouter.get("/:id",authMiddleware,async(req,res)=>{
    //@ts-ignore
    const id=req.id;
    const zap=await client.zap.findFirst({
        where:{
            id:req.params.id,
            userId:id
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
                }
            }
        }
    });

    if(!zap){
        return res.status(404).json({error:"Zap not found"});
    }

    return res.json(zap.id);
})

export default ZapRouter;