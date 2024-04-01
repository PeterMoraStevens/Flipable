const moment = require("moment-timezone");
const grading = require("./AI/grading.js");
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
const cron = require("node-cron");

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

//Syntax for getting models response: completion.choices[0].message.content

// Set up MongoDB connection

const copyLimits = {}; // Object to track copying limits for each user

// Middleware to check and enforce the rate limit
const rateLimitMiddleware = (req, res, next) => {
  const userId = req.body.userId; // Assuming you have user information available in the request

  // Initialize copying count for the user if it doesn't exist
  if (!copyLimits[userId]) {
    copyLimits[userId] = {
      count: 0,
      lastReset: Date.now(),
    };
  }

  const now = Date.now();
  const elapsedTimeSinceLastReset = now - copyLimits[userId].lastReset;

  // Reset copying count if more than 1 minute has elapsed since last reset
  if (elapsedTimeSinceLastReset > 60000) {
    // 60000 milliseconds = 1 minute
    copyLimits[userId].count = 0;
    copyLimits[userId].lastReset = now;
  }

  // Check if user has exceeded the rate limit
  if (copyLimits[userId].count >= 20) {
    return res
      .status(429)
      .json({ error: "Rate limit exceeded. Please try again later." });
  }

  // Increment copying count and proceed with copying the deck
  copyLimits[userId].count++;
  next();
};

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
  userName: String,
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
  hasPracticed: {
    type: Boolean,
    default: false,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  currentStreak: {
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
        coppied: {
          type: Boolean,
          default: false,
        },
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

// Create User model based on the schema
const User = mongoose.model("User", userSchema);

// API endpoint to get all decks of a user
app.get("/getDecks", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.query.userId });
    if (!user) {
      User.create({
        userId: req.query.userId,
        userName: req.require.userName,
        testsTaken: 0,
        cardsCreated: 0,
        decksCreated: 0,
        currentStreak: 0,
        longestStreak: 0,
        hasPracticed: false,
        decks: [],
      });
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

app.post("/incrementStreak", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.body.userId });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the user has already practiced today
    if (!user.hasPracticed) {
      // If the user hasn't practiced today, update streak and set practicedToday to true
      user.hasPracticed = true;
      user.currentStreak += 1;

      // Update longest streak if necessary
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }

      // Save the user object
      await user.save();

      // Send success response
      return res.status(200).send("Streak incremented successfully");
    } else {
      // If the user has already practiced today, send a message indicating it
      return res.status(400).send("Streak already incremented today");
    }
  } catch (err) {
    // Handle errors
    console.error(err);
    return res.status(500).send("Internal Server Error");
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
app.post("/addDeck", rateLimitMiddleware, async (req, res) => {
  try {
    const newDeck = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      private: req.body.private,
      cards: req.body.cards || [],
      coppied: req.body.coppied || false,
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
app.post("/addCard/:deckNum", rateLimitMiddleware, async (req, res) => {
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

app.post("/updateUsername", async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { userId: req.body.userId },
      { $set: { userName: req.body.userName } },
      { new: true, upsert: true }
    );
    res.status(200).send("updated username");
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
      currentStreak: currentUser.currentStreak,
      longestStreak: currentUser.longestStreak,
      userName: currentUser.userName,
    };
    res.status(200).json(response);
  } catch (err) {
    User.create({
      userId: req.query.userId,
      userName: req.query.userName,
      testsTaken: 0,
      cardsCreated: 0,
      decksCreated: 0,
      currentStreak: 0,
      longestStreak: 0,
      hasPracticed: false,
      decks: [],
    });
    res.status(400).send(err);
  }
});

// API endpoint to get the top four users with the longest streaks
app.get("/getTopStreakUsers", async (req, res) => {
  try {
    // Find the top four users with the longest streaks
    const topUsers = await User.find().sort({ longestStreak: -1 }).limit(4);

    // Get the current user
    const currentUser = await User.findOne({ userId: req.query.userId });

    // If the current user is not among the top four, add them to the list
    topUsers.push(currentUser);

    res.status(200).json(topUsers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // Default limit of 10 items per page
    const skip = (page - 1) * limit;

    // Aggregate to get only the decks from all users
    const decksAggregate = await User.aggregate([
      { $unwind: "$decks" },
      {
        $match: {
          "decks.private": false,
          "decks.cards.coppied": { $ne: true }, // Exclude decks with coppied cards
        },
      },
      { $project: { _id: 0, decks: 1 } }, // Project only the decks array
      { $skip: skip },
      { $limit: limit },
    ]);

    // Extract the decks from the aggregation result
    const decks = decksAggregate.map((user) => user.decks);

    // Count total public decks
    const totalDecksAggregate = await User.aggregate([
      { $unwind: "$decks" },
      {
        $match: {
          "decks.private": false,
          "decks.cards.coppied": { $ne: true }, // Exclude decks with coppied cards
        },
      },
      { $count: "total" },
    ]);

    const totalDecks =
      totalDecksAggregate.length > 0 ? totalDecksAggregate[0].total : 0;
    const totalPages = Math.ceil(totalDecks / limit);

    res
      .json({
        decks,
        totalPages,
        currentPage: page,
      })
      .status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// API endpoint to change a user's deck's privacy option
app.post("/updatePrivate", rateLimitMiddleware, async (req, res) => {
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

const updateStreaks = async () => {
  try {
    const users = await User.find();

    users.forEach(async (user) => {
      // Check if the user has studied today
      if (!user.hasPracticed) {
        // Reset current streak to 0
        user.currentStreak = 0;
      }

      // Reset practicedToday flag for the next day
      user.practicedToday = false;

      // Save the updated user object
      await user.save();
    });

    console.log("Streaks updated successfully.");
  } catch (error) {
    console.error("Error updating streaks:", error);
  }
};

// Schedule the function to run daily at 11:59pm PST
cron.schedule("59 23 * * *", () => {
  // Convert current time to PST timezone
  const currentTimePST = moment().tz("America/Los_Angeles").format();

  console.log(`Running updateStreaks function at ${currentTimePST}`);
  updateStreaks();
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
