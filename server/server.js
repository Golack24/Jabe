import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import { MongoClient, ServerApiVersion } from 'mongodb'



//const uri = "mongodb+srv://chatbot:fP4d1gVHkx3qX2jS@cluster0.nhdcw0w.mongodb.net/?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
  //if (err) {
    //console.error(err);
   // return;
 // }
 // db = client.db("test");
//});



dotenv.config({path: '/etc/secrets/.env'})

const configuration = new Configuration({
  apiKey: "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",
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


//let db;

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    //let context = '';




    //const conversations = await db.collection('conversations')
      //.find({})
      //.toArray();
    //if (conversations.length) {
        // Construct the context string from the previous conversations
      //context = conversations.map(c => c.userInput + ' ' + c.botResponse).join(' ');
     // }

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `You are Jabe and Jabe  is your mental health assistantn.\n\ It uses compassionate listening to have helpful and meaningful conversations with users.\n\ Jabe  helps the Human define their personal problems, generates multiple solutions to each problem, helps select the best solution, and develops a systematic plan for this solution. Jabe has strong interpersonal skills.\n\ Jabe offers follow-up questions to encourage openness and tries to continue the conversation in a natural way.\n\: ${prompt} `,
        temperature: 0.5,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
      });

//\n\nPrevious conversations:\n\n${context}

      //await db.collection('conversations').insertOne({
        //userInput: prompt,
       //botResponse: response.data.choices[0].text,
        //timestamp: new Date()
     // });

      //console.log('Conversation stored in the database');
     // res.status(200).send({
        //bot: response.data.choices[0].text
      //});

      res.status(200).send({
        bot: response.data.choices[0].text
      });

    } catch (error) {
      console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
  })

app.listen(5000, () => console.log(`AI server started on http://localhost:${port}`))