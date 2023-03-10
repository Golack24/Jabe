import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import fs from 'fs'
import util from 'util'


dotenv.config()


const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);


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
    let conversationHistory = ''; // Get previous convo history
    try {
      conversationHistory = await readFile('conversation-history.txt', 'utf-8'); // reads contents of the file 
    } catch (error) {
      console.error(error);
    }


      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `The following is a conversation with an AI mental health assistant chatbot. 
        The assistant is called Jabe and it is helpful, creative, clever, and very friendly.It uses 
        compassionate listening to have helpful and meaningful conversations with users. Jabe helps 
        the Human define their personal problems, generates multiple solutions to each problem, helps 
        select the best solution, and develops a systematic plan for this solution. Jabe has strong 
        interpersonal skills.Jabe offers follow-up questions to encourage openness and tries to 
        continue the conversation in a natural way:${conversationHistory}\n ${prompt} `,
        temperature: 0.05,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
      });

      await writeFile('conversation-history.txt', prompt + '\n' + response.data.choices[0].text, { flag: 'a' });


      res.status(200).send({
        bot: response.data.choices[0].text.replace("AI:", "")
      });

    } catch (error) {
      console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
  })

app.listen(5000, () => console.log(`AI server started on http://localhost:${port}`))
