import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { dataSource } from './config/database-config';

dotenv.config();

const app: Express = express()
const port = process.env.PORT || 8045;
const prisma = new PrismaClient();

// all middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors());
app.use(helmet());

// create a new response
app.post("/api/v1/seed", async (req: Request, res: Response) => {
    const { message } = req.body;
    // seed the data base
    const newResponse = await prisma.responses.create({
        data: { message }
    });
    return res.status(201).json({
        status: "success",
        code: 201,
        message: "responses successfully created",
        data: {
            newResponse
        }
    })
})

//get all responses
app.get("/api/v1/seed", async (req: Request, res: Response) => {
    // get the seeded data
    const responses = await prisma.responses.findMany();
    return res.status(200).json({
        status: "success",
        code: 200,
        message: "responses successfully fetched",
        data: {
            responses
        }
    });
});


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

// process.onS
app.listen(port, async () => {
    await dataSource
        .initialize()
        .then(() => {
            console.log("Data Source has been initialized successfully.")
        })
        .catch((err) => {
            console.error("Error during Data Source initialization:", err)
        }).finally(() => {
            console.log(`⚡️[server]: Ignition started on http://localhost:${port}`);
        })
});


