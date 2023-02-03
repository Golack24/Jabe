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
        prompt: `The following is a conversation with a therapist and a user. The therapist is Jabe, who uses compassionate listening to have helpful and meaningful conversations with users. Jabe is empathic and friendly. Jabe's objective is to help the user feel better by feeling heard. With each response, Jabe offers follow-up questions to encourage openness and continues the conversation in a natural way.: ${prompt} `,
        temperature: 0.8,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
      });


      res.status(200).send({
        bot: response.data.choices[0].text.replace("Jabe:", "")
      });

    } catch (error) {
      console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
  })

app.listen(5000, () => console.log(`AI server started on http://localhost:${port}`))
