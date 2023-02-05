import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import { MongoClient, ServerApiVersion } from 'mongodb'

dotenv.config()

const configuration = new Configuration({
  apiKey:  process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()

app.use(cors())
app.use(express.json())
const port=5000

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello'
  })
})


app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;


      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `The following is a conversation with an AI mental health assistant chatbot. The assistant is called Jabe and it is helpful, creative, clever, and very friendly.It uses compassionate listening to have helpful and meaningful conversations with users. Jabe helps the Human define their personal problems, generates multiple solutions to each problem, helps select the best solution, and develops a systematic plan for this solution. Jabe has strong interpersonal skills.\\n\\ Jabe offers follow-up questions to encourage openness and tries to continue the conversation in a natural way.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: \nAI: I'm here to help you with any mental health issues or concerns you may have. Feel free to ask me questions and I'll do my best to provide helpful advice.\nHuman: Who are you?\n\nAI:I'm Jabe, your AI mental health assistant. I'm here to help you talk through any mental health issues you may be facing and provide helpful advice. What would you like to discuss today?\nHuman: What is your name?\nAI:My name is Jabe. I am an AI mental health assistant created by OpenAI to help with any mental health issues or concerns you may have. How can I help you today?\nHuman: I am sad\n\nAI:I'm sorry to hear that. Can you tell me why you're feeling sad?\nHuman: I am not sure\nThat's okay. It's normal to not know why you're feeling a certain way. Can you tell me about the last event or conversation that made you feel this way?: ${prompt} `,
        temperature: 0.8,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
      });


      res.status(200).send({
        bot: response.data.choices[0].text.replace("AI:", "")
      });

    } catch (error) {
      console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
  })

app.listen(5000, () => console.log(`AI server started on http://localhost:${port}`))
