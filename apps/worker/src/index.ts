import {Kafka} from "kafkajs";
import { PrismaClient } from "@prisma/client";
import { parse } from "./parser.js";
import { JsonObject } from "@prisma/client/runtime/library";
import { sendEmail } from "./email.js";
import { sendSol } from "./solana.js";

const client=new PrismaClient();

const kafka=new Kafka({
    clientId:"outbox-processor",
    brokers:["localhost:9092"]
})

async function main(){
    const consumer=kafka.consumer({groupId:"main-worker"});
    const producer=kafka.producer();
    await consumer.connect();

    await consumer.subscribe({topic:"zap-events"});

    await consumer.run({
        autoCommit:false,//This doesn't directly tell kafka that processing is done and happens only after i call ()
        eachMessage:async({topic,partition,message})=>{
            console.log({
                partition,
                offset:message.offset,
                value:message.value?.toString()
            })

            if(!message.value?.toString()){
                return;
            }

            const parsedMessage=JSON.parse(message.value.toString());
            const {zapRunId,stage}=parsedMessage;

            const zapRunDetails=await client.zapRun.findUnique({
                where:{id:zapRunId},
                include:{
                    zap:{
                        include:{
                            actions:{
                                include:{
                                    type:true
                                }
                            }
                        }
                    }
                }
            })

            const currentAction=zapRunDetails?.zap.actions.find(x=>x.sortingOrder===stage);

            if(!currentAction){
                console.log("No action found");
                return;
            }

            const zapRunMetadata=zapRunDetails?.metadata

            if(currentAction.type.name==='email'){
                const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetadata);
                const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunMetadata);
                console.log(`Sending out email to ${to} body is ${body}`)
                await sendEmail(to, body);
            }

            if(currentAction.type.name==='solana'){
                const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetadata);
                const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetadata);
                console.log(`Sending out SOL of ${amount} to address ${address}`);
                await sendSol(address, amount);
            }

            await new Promise(r=>setTimeout(r,500));

            const zapId=message.value.toString();
            const lastStage=(zapRunDetails?.zap.actions.length||1)-1;
            if(lastStage!==stage){
                await producer.send({
                    topic:"zap-events",
                    messages:[{
                        key:zapId,
                        value:JSON.stringify({
                            zapRunId:zapRunId,
                            stage:stage+1
                        })
                    }]
                });
            }

            console.log("Committing offset");

            await consumer.commitOffsets([{
                topic:"zap-events",
                partition:0,
                offset:(parseInt(message.offset)+1).toString()
            }])
        }
    })
}

main()