import { uuid } from 'uuidv4';
import { Request, Response } from "express";
import { dataSource } from "../config/database-config";
import { Response as ResponseSchema } from "../models";
const ResponseModel = dataSource.getRepository(ResponseSchema);


export default class Controllers {
    static async saveResponse(req: Request, res: Response) {
        try {
            const { message } = req.body;
            const newResponse = new ResponseSchema();
            newResponse.response = message;
            newResponse.id = uuid();
            await ResponseModel.save(newResponse);
            return res.status(201).json({
                status: "success",
                code: 201,
                message: "responses successfully created",
                data: {
                    newResponse
                }
            })
        } catch (error) {
            return res.status(500).json({
                status: "success",
                code: 500,
                message: (error as Error).message,
                data: null
            })
        }
    }

}