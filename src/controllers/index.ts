import { uuid } from 'uuidv4';
import { Request, Response } from "express";
import { dataSource } from "../config/database-config";
import { Response as ResponseSchema } from "../models";
import { Configuration, OpenAIApi } from "openai";
const ResponseModel = dataSource.getRepository(ResponseSchema);


export default class Controllers {
    static async saveResponse(req: Request, res: Response) {
        try {
            const { question, answer } = req.body;
            // validation rules
            if (!question || !answer) {
                return res.status(400).json({
                    status: "success",
                    code: 400,
                    message: "bad request",
                    data: null
                })
            }
            const newResponse = new ResponseSchema();
            newResponse.question = question;
            newResponse.answer = answer;
            newResponse.id = uuid();
            await ResponseModel.save(newResponse);
            return res.status(201).json({
                status: "success",
                code: 201,
                message: "responses successfully recorded",
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


    static async getResponses(req: Request, res: Response) {
        try {
            const responses = await ResponseModel.find();
            return res.status(201).send({
                status: "success",
                code: 201,
                message: "responses successfully fetched",
                data: {
                    responses
                }
            })
        } catch (error) {
            return res.status(500).json({
                status: "error",
                code: 500,
                message: (error as Error).message,
                data: null
            })
        }
    }


    static async chat(req: Request, res: Response) {
        const { query } = req.body
        if (!req.body) {
            return res.status(400).send({
                status: "error",
                code: 400,
                message: "missing payload"
            })
        }
        try {
            const configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);
            const response: any = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `\nHuman: ${query.trim()}?`,
                temperature: 0.9,
                max_tokens: 150,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0.6,
                stop: [" Human:", " AI:"],
            });

            //   res.send(response)
            //   console.log(JSON.stringify(response.data));

            return res.send({
                status: "success",
                code: 200,
                message: "responses successfully fetched",
                data: {
                    reply: response.data.choices[0]
                }
            })
        } catch (error) {
            return res.status(500).json({
                status: "error",
                code: 500,
                message: (error as Error).message,
                data: null
            })
        }
    }
}


function generatePrompt(message: String) {
    return `The following is a conversation with an AI assistant.
     The assistant is helpful, creative, clever, and very friendly.
     
     Human: Hello, who are you?
     AI: I am an AI created by OpenAI. How can I help you today?
     Human:${message}?`;
}