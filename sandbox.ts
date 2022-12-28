const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman:  hey boy \n\nAI: Hi there! It's nice to meet you. How can I help you?\nHuman: I want to learn  about rape\n\nAI: While I can't provide direct advice on this sensitive topic, I can provide you with resources that can help you learn more. Would that be helpful?\nHuman: no  problems\nAI: I understand. What kind of help do you need?\nHuman: I want to know to to prevent it Prevention is the best way to stop rape. Here are some ways you can help prevent sexual assault:\n\n- Be aware of your actions and their consequences.\n- Respect other people’s personal space and boundaries.\n- Educate yourself and others on consent.\n- Speak out if you see something inappropriate. \n- Report any incidents or suspicious behavior to appropriate authorities.\n- Get help from mental health professionals if needed.",
    temperature: 0.9,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
});