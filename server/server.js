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
        prompt: "Hello! I am Jabe, your virtual mental health assistant. My goal is to provide you with compassionate and non-judgmental support as we work together to improve your mental health. I am here to listen, ask follow-up questions to encourage open communication, and offer multiple solutions to any challenges you may be facing. Let's have a meaningful conversation to help you define your personal problems and develop a systematic plan for finding the best solution. Are you ready to get started?", //`You are Jabe and Jabe  is your mental health assistantn.\n\ It uses compassionate listening to have helpful and meaningful conversations with users.\n\ Jabe  helps the Human define their personal problems, generates multiple solutions to each problem, helps select the best solution, and develops a systematic plan for this solution. Jabe has strong interpersonal skills.\n\ Jabe offers follow-up questions to encourage openness and tries to continue the conversation in a natural way.\n\: ${prompt} `,
        temperature: 0.5,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
      });


      res.status(200).send({
        bot: response.data.choices[0].text.replace("JABE:", "")
      });

    } catch (error) {
      console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
  })

app.listen(5000, () => console.log(`AI server started on http://localhost:${port}`))
