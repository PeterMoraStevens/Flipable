// Import required modules
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");

<<<<<<< HEAD
// Import grading module
=======
app.use(express.json());

>>>>>>> 488d71b2438df657d9c44bbecd2d3183c6c23ffe
let grading;
try {
  grading = import("./../AI/grading.js");
} catch (error) {
  console.error("Error importing grading.js:", error);
}

// Set up MongoDB connection
const DBURL = process.env.MONGODB_DATABASE_URL;
app.use(cors());

// Connect to MongoDB
if (!process.env.MONGODB_DATABASE_URL) {
  console.error("MongoDB URL is not provided!");
  process.exit(1);
}

mongoose
  .connect(`${DBURL}`)
  .then(console.log("Connected to DB"))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: String,
  testsTaken: {
    type: Number,
    default: 0
  },
  decksCreated: {
    type: Number,
    default: 0
  },
  cardsCreated: {
    type: Number,
    default: 0
  },
  decks: {
    type: [
        {
            title: String,
            category: String,
            description: String,
            cards: [
                {
                    term: String,
                    definition: String
                }
            ]
        }
    ],
    default: []
  }
});

const User = mongoose.model("User", userSchema);

app.post("/addDeck", async (req, res) => {
  // deckName, deckCategory, deckDesc
  try {
    const newDeck = {
      title: req.body.deckName,
      category: req.body.deckCategory,
      description: req.body.deckDesc,
      cards: [],
    };
    //add deck to current user's deck array, update mongoDB
    await User.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: {decks: newDeck} },
      { new: true, upsert: true }
    );
    res.status(200).send("Deck added successfully");
<<<<<<< HEAD
  } catch (error) {
=======
  } catch(error) {
>>>>>>> 488d71b2438df657d9c44bbecd2d3183c6c23ffe
    console.error(error);
    res.status(400);
  }
});

app.post("/addCard/:decknum", async (req, res) => {
  // cardTerm, cardDef
  try {
    const newCard = {
      term: req.body.cardTerm,
      definition: req.body.cardDef,
    };
    //add card to current user's deck, update mongoDB
    const currentUser = await User.findOne({ userId: req.body.userId });
    currentUser.decks[req.params.decknum].push(newCard);
    await currentUser.save();
    res.status(200);
<<<<<<< HEAD
  } catch (error) {
=======
  } catch(error) {
>>>>>>> 488d71b2438df657d9c44bbecd2d3183c6c23ffe
    console.error(error);
    res.status(400);
  }
});

app.post("/editCard/:decknum", async (req, res) => {
    try {
      const newCard = {
        term: req.body.cardTerm,
        definition: req.body.cardDef,
      };
      const currentUser = await User.findOne({ userId: req.body.userId });
      currentUser.decks[req.params.decknum].splice(req.params.decknum, 1, newCard);
      await currentUser.save();
      res.status(200);
<<<<<<< HEAD
    } catch (error) {
=======
    } catch(error) {
>>>>>>> 488d71b2438df657d9c44bbecd2d3183c6c23ffe
      console.error(error);
      res.status(400);
    }
});

app.post("/incrementDeck", async (req, res) => {
    try {
      const currentUser = await User.findOne({ userId: req.body.userId });
      currentUser.decksCreated++;
      await currentUser.save();
      res.status(200);
<<<<<<< HEAD
    } catch (error) {
=======
    } catch(error) {
>>>>>>> 488d71b2438df657d9c44bbecd2d3183c6c23ffe
      console.error(error);
      res.status(400);
    }
  });

app.post("/incrementCard", async (req, res) => {
    try {
        const currentUser = await User.findOne({ userId: req.body.userId });
        currentUser.cardsCreated++;
        await currentUser.save();
        res.status(200);
<<<<<<< HEAD
    } catch (error) {
=======
    } catch(error) {
>>>>>>> 488d71b2438df657d9c44bbecd2d3183c6c23ffe
        console.error(error);
        res.status(400);
    }
});

app.post("/incrementTests", async (req, res) => {
    try {
      const currentUser = await User.findOne({ userId: req.body.userId });
      currentUser.testsTaken++;
      await currentUser.save();
      res.status(200);
<<<<<<< HEAD
    } catch (error) {
=======
    } catch(error) {
>>>>>>> 488d71b2438df657d9c44bbecd2d3183c6c23ffe
      console.error(error);
      res.status(400);
    }
  });

//calls test, passes in real definitions, test definitions, terms
app.post("/test", async (req, res) => {
  const finalGrade = await grading(
    req.body.realDef,
    req.body.testDef,
  );
  res.status(200).send(finalGrade);
});

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
    res.status(404).send("Internal Server Error");
  }
});

app.get("/getFlashcards/:decknum", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.query.userId });
    const deckNum = req.params.decknum;
    if (!user) {
        console.log("User Not Found");
        return res.status(404).send("User Not Found");
    }
    const decks = user.decks;
    if (!decks) {
        console.log("Decks Not Found");
        return res.status(404).send("Decks Not Found");
    }
    res.json(decks[deckNum]);
  } catch (error) {
    console.error(error);
    res.status(404).send("Internal Server Error");
  }
});

app.get("/deleteDecks", async (req, res) => {
  try {
    const currentUser = User.findOne({ userId: req.query.userId });
    currentUser.decks.splice(req.query.deckNum, 1);
    await currentUser.save();
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/deleteCard", async (req, res) => {
  try {
    const currentUser = User.findOne({ userId: req.query.userId });
    currentUser.decks[req.query.deckNum].splice(req.query.i, 1);
    await currentUser.save();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/decrementDeck", async (req, res) => {
    try {
        const currentUser = await User.findOne({ userId: req.body.userId });
        currentUser.decksCreated--;
        await currentUser.save();
        res.status(200);
<<<<<<< HEAD
    } catch (error) {
=======
    } catch(error) {
>>>>>>> 488d71b2438df657d9c44bbecd2d3183c6c23ffe
        console.error(error);
        res.status(400);
    }
});

app.post("/decrementCard", async (req, res) => {
    try {
        const currentUser = await User.findOne({ userId: req.body.userId });
        currentUser.cardsCreated--;
        await currentUser.save();
        res.status(200);
    } catch (error) {
        console.error(error);
        res.status(400);
    }
});

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});