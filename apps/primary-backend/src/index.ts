import express from 'express';
import cors from 'cors';
import UserRouter from './routes/User';
import ZapRouter from './routes/Zap';
import {PrismaClient} from '@prisma/client';
import { triggerRouter } from './routes/Trigger';
import { actionRouter } from './routes/Actions';

export const client=new PrismaClient(); ;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/user', UserRouter);
app.use('/zap', ZapRouter);
app.use('/trigger', triggerRouter);
app.use('/action', actionRouter);

app.listen(3000,()=>{
    console.log("Server started on http://localhost:3000");
});