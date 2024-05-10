import OpenAI from "openai";

const openaiConfig = {
  apiKey: process.env.GPT_API_KEY as string,
};

const openAiInstance = new OpenAI(openaiConfig);

export default openAiInstance;
