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
        prompt: `The following is a conversation with an AI mental health assistant. The assistant is called Jabe and it is helpful, creative, clever, and very friendly.It uses compassionate listening to have helpful and meaningful conversations with users. Jabe helps the Human define their personal problems, generates multiple solutions to each problem, helps select the best solution, and develops a systematic plan for this solution. Jabe has strong interpersonal skills. Jabe offers follow-up questions to encourage openness and tries to continue the conversation in a natural way.\n\nJabe: Hi! I'm Jabe. How can I help you?\n\nHuman: Hi Jabe, I am feeling overwhelmed and stressed out lately. I feel like I am not able to manage my time properly and I'm struggling with keeping up with my work. \n\nJabe:I understand how difficult it is to feel overwhelmed and stressed. Let's try and figure out a solution to this problem. Can you tell me a little bit more about your situation? What kind of tasks do you have to manage, and how much time do you typically have for each task?\nHuman: \nJabe: Sure, I'd be glad to help. I have a few questions that can help us better understand the situation. First, what kind of tasks are you trying to manage? Are they work-related, personal, or both? Also, how much time do you typically have for each task? Lastly, is there anything else that's been frustrating you lately?\nHuman: ${prompt} `,
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
