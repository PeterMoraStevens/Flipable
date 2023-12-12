// Import required modules
import OpenAI from "openai";
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");

app.use(express.json());
app.use(express.static('dist'));
// app.use(cors());
// Import grading module


//Syntax for getting models response: completion.choices[0].message.content


// Set up MongoDB connection

const DBURL = process.env.MONGODB_DATABASE_URL;
app.use(cors());

// Check if MongoDB URL is provided
if (!process.env.MONGODB_DATABASE_URL) {
  console.error("MongoDB URL is not provided!");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(`${DBURL}`)
  .then(console.log("Connected to DB"))
  .catch((err) => console.log(err));

// Create User model based on the schema
const Schema = mongoose.Schema;
const userSchema = new Schema({
  userId: String,
  testsTaken: {
    type: Number,
    default: 0,
  },
  decksCreated: {
    type: Number,
    default: 0,
  },
  cardsCreated: {
    type: Number,
    default: 0,
  },
  decks: {
    type: [
      {
        title: String,
        category: String,
        description: String,
        private: Boolean,
        cards: [
          {
            term: String,
            definition: String,
          },
        ],
      },
    ],
    default: [],
  },
});

async function grade(def1, def2, word) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant who evaluates the similarity between two definitions.",
      }, // Prompt introduction
      {
        role: "user",
        content: `I'm presenting two definitions for the term "${word}".`,
      },
      { role: "assistant", content: `Definition 1: ${def1}` },
      { role: "assistant", content: `Definition 2: ${def2}` },
      {
        role: "user",
        content: `Compare the semantic similarity between two input definitions and output 'yes' if they convey similar meanings, even with potential syntactic differences, and 'no' if their meanings significantly differ. Focus on capturing the essence of their definitions rather than strict syntactical matching.`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  //   console.log(completion.choices[0]);
  if (completion.choices[0].message.content === "Yes") {
    //gets the checks the response
    return true;
  }
  return false;
}

/*Possible Example array for realDefs and testDefs
    realDefs = [{term: "hello", def: "a greeting"}, {term: "goodbye", def: "a farewell"}]
    testDefs = [{term: "hello", def: "a greeting"}, {term: "goodbye", def: "a farewell"}

*/

async function gradeTest(realDefs, testDefs) {
  let score = 0;
  let finalScore = []; //holds all questions correctness 0 - wrong | 1 - right
  for (let i = 0; i < realDefs.length; i++) {
    let correct = await grade(
      realDefs[i].definition,
      testDefs[i],
      realDefs[i].term
    );
    if (correct) {
      finalScore.push(1);
      score++;
    } else {
      finalScore.push(0);
    }
  }
  finalScore.push(score); //last index is the final score
  return finalScore;
}

// Create User model based on the schema
const User = mongoose.model("User", userSchema);

// API endpoint to get all decks of a user
app.get("/getDecks", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.query.userId });
    if (!user) {
      console.log("User Not Found");
      return res.status(404).send("User Not Found");
    }
    const decks = user.decks;
    if (!decks) {
      console.log("Decks Not Found");
      return res.status(404).send("Decks Not Found");
    }
    res.json(decks);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// API endpoint to get all flashcards from a specific deck of a user
app.get("/getFlashcards/:deckNum", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.query.userId });
    const deckNum = req.params.deckNum;
    if (!user) {
      console.log("User Not Found");
      return res.status(404).send("User Not Found");
    }
    const decks = user.decks;
    if (!decks) {
      console.log("Decks Not Found");
      return res.status(404).send("Decks Not Found");
    }
    if (deckNum < 0 || deckNum >= decks.length) {
      console.log("Invalid Deck Number");
      return res.status(404).send("Invalid Deck Number");
    }
    res.json(decks[deckNum].cards);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// API endpoint to add a new deck to the user's decks
app.post("/addDeck", async (req, res) => {
  try {
    const newDeck = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      private: req.body.private,
      cards: req.body.cards || [],
    };
    await User.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { decks: newDeck } },
      { new: true, upsert: true }
    );
    res.status(200).send("Deck added successfully");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// API endpoint to add a new card to a specific deck
app.post("/addCard/:deckNum", async (req, res) => {
  try {
    const newCard = {
      term: req.body.term,
      definition: req.body.definition,
    };
    const currentUser = await User.findOne({ userId: req.body.userId });
    currentUser.decks[req.params.deckNum].cards.push(newCard);
    await currentUser.save();
    res.status(200).send("Card added");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// API endpoint to edit a card in a specific deck
app.post("/editCard/:decknum", async (req, res) => {
  try {
    const newCard = {
      term: req.body.cardTerm,
      definition: req.body.cardDef,
    };
    const currentUser = await User.findOne({ userId: req.body.userId });
    currentUser.decks[req.params.decknum].splice(
      req.params.decknum,
      1,
      newCard
    );
    await currentUser.save();
    res.status(200).send("Card edited");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// API endpoint to increment the count of decks created by a user
app.post("/incrementDeck", async (req, res) => {
  try {
    const currentUser = await User.findOne({ userId: req.body.userId });
    currentUser.decksCreated++;
    await currentUser.save();
    res.status(200).send("Incremented");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// API endpoint to increment the count of cards created by a user
app.post("/incrementCard", async (req, res) => {
  try {
    const currentUser = await User.findOne({ userId: req.body.userId });
    currentUser.cardsCreated++;
    await currentUser.save();
    res.status(200).send("Incremented");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// API endpoint to increment the count of tests taken by a user
app.post("/incrementTests", async (req, res) => {
  try {
    const currentUser = await User.findOne({ userId: req.body.userId });
    currentUser.testsTaken++;
    await currentUser.save();
    res.status(200).send("Incremented");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

app.get("/getUser", async (req, res) => {
  try {
    const currentUser = await User.findOne({ userId: req.query.userId });
    const response = {
      testsTaken: currentUser.testsTaken,
      decksCreated: currentUser.decksCreated,
      cardsCreated: currentUser.cardsCreated,
    };
    res.status(200).json(response);
  } catch (err) {
    const response = {
      testsTaken: 0,
      decksCreated: 0,
      cardsCreated: 0,
    };
    console.error(err);
    res.status(400).send(err).json(response);
  }
});

//calls test, passes in real definitions, test definitions, terms
app.post("/test", async (req, res) => {
  try {
    const finalGrade = await grading.gradeTest(
      req.body.realDef,
      req.body.answers
    );
    res.status(200).send(finalGrade);
  } catch (err) {
    res.status(400).send(err);
  }
});

// API endpoint to delete a user's decks
app.delete("/deleteDecks", async (req, res) => {
  try {
    const num = parseInt(req.query.deckNum);
    const currentUser = await User.findOne({ userId: req.query.userId });
    currentUser.decks.splice(num, 1);
    await currentUser.save();
    res.status(200).send("Deleted Deck");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// API endpoint to delete a card from a specific deck of a user
app.delete("/deleteCard", async (req, res) => {
  try {
    const num = parseInt(req.query.deckNum);
    const currentUser = await User.findOne({ userId: req.query.userId });
    currentUser.decks[num].cards.splice(req.query.i, 1);
    await currentUser.save();
    res.status(200).send("Deleted Card");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// API endpoint to find all public decks and return them
app.get("/getCommunityDecks", async (req, res) => {
  try {
    let allDecks = [];
    const users = await User.find({});
    // console.log(users)
    //for every person, for every deck, add public decks to the alldecks array
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users[i].decks.length; j++) {
        if (users[i].decks[j].private == false) {
          allDecks.push(users[i].decks[j]);
        }
      }
    }
    res.json(allDecks).status(200);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// API endpoint to change a user's deck's privacy option
app.post("/updatePrivate", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.body.userId });
    user.decks[req.body.deckNum].private =
      !user.decks[req.body.deckNum].private;
    user.save();
    res.status(200).send("Updated Private");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
