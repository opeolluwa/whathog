import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { dataSource } from './config/database-config';
import router from './routes';

dotenv.config();

const app: Express = express()
const port = process.env.PORT || 8045;

// all middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors());
app.use(helmet());
app.use("/api/v1/", router)


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
            console.log(`Ignition started on http://localhost:${port}`);
        })
});


