import { uuid } from 'uuidv4';
import { Request, Response } from "express";
import { dataSource } from "../config/database-config";
import { Response as ResponseSchema } from "../models";
import { Configuration, OpenAIApi } from "openai";
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
      try {
          const configuration = new Configuration({
              apiKey: process.env.OPENAI_API_KEY,
          });
          const openai = new OpenAIApi(configuration);
          const response = await openai.createCompletion({
              model: "text-davinci-003",
              prompt: generatePrompt("Bird"),
              temperature: 0.9,
              max_tokens: 150,
              /* top_p: 1,
              frequency_penalty: 0,
              presence_penalty: 0.6,
              stop: [" Human:", " AI:"], */
          });

        //   res.send(response)
          console.log(JSON.stringify(response));
          
         /*  return res.send({
              status: "success",
              code: 201,
              message: "responses successfully fetched",
              data: {
                  response
              }
          }) */
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
    const capitalizedAnimal =
        message[0].toUpperCase() + message.slice(1).toLowerCase();
    return `Suggest three names for an animal that is a superhero.
Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}

// "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman:  hey boy \n\nAI: Hi there! It's nice to meet you. How can I help you?\nHuman: I want to learn  about rape\n\nAI: While I can't provide direct advice on this sensitive topic, I can provide you with resources that can help you learn more. Would that be helpful?\nHuman: no  problems\nAI: I understand. What kind of help do you need?\nHuman: I want to know to to prevent it Prevention is the best way to stop rape. Here are some ways you can help prevent sexual assault:\n\n- Be aware of your actions and their consequences.\n- Respect other people’s personal space and boundaries.\n- Educate yourself and others on consent.\n- Speak out if you see something inappropriate. \n- Report any incidents or suspicious behavior to appropriate authorities.\n- Get help from mental health professionals if needed."