require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3000;
const mongoose = require('mongoose');


const DBURL = process.env.MONGODB_DATABASE_URL
app.use(cors())

if (!process.env.MONGODB_DATABASE_URL) {
    console.error('MongoDB URL is not provided!');
    process.exit(1);
}

main().catch(err => console.log(err));


async function main() {
  await mongoose.connect(`${DBURL}`);
    //await mongoose.connect('mongodb://Quizzers:I<3Quizify@127.0.0.1:27017/test');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {
        type: String, 
        required: true
    },
    decks: [{
        type: Schema.Types.ObjectId, 
        ref: "Deck"
    }],
});

const deckSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cards: [{
        type: Schema.Types.ObjectId, 
        ref: "Card",
        required: true
    }],
    index: {
        type: Number,
        required: true
    },
    parentUser: {
        //user id of parent user
        type: String,
        required: true
    },
});

const cardSchema = new Schema({
    term: {
        type: String,
        required: true
    },
    definition: {
        type: String,
        required: true
    },
    parentDeck: {
        //index of parent deck
        type: Number,
        required: true
    },
    parentUser: {
        //user id of parent user
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);
const Deck = mongoose.model("Deck", deckSchema);
const Card = mongoose.model("Card", cardSchema);

//add new user
app.post('/newuser', async(req, res) => {
    try{
        const newUser = await User.create({
            userId: req.body.userId,
            decks: []
        });
        //add user to mongodb database
        newUser.save();
        res.send("successfully created new user");
    } catch{
        res.send("error");
    }
});

//add new deck
app.post('/newdeck', async(req, res) => {
    try{
        const newDeck = await Deck.create({
            name: req.body.deckName,
            category: req.body.deckCategory,
            description: req.body.deckDesc,
            cards: [],
            index: req.body.i,
            parentUser: req.body.parentUser
        });
        console.log(newDeck);
        //add deck to current user's deck array, update mongoDB
        const currentUser = User.findOne({userId: parentUser});
        currentUser.decks.push(newDeck);
        currentUser.save();
        res.send("successfully created new deck");
    } catch{
        res.send("error");
    }

});

//add new card to deck
app.post('/newcard', async(req, res) => {
    try{
        const newCard = await Card.create({
            term: req.body.term,
            definition: req.body.definition,
            parentDeck: req.body.parentDeck,
            parentUser: req.body.parentUser
        });
        //add card to current user's deck, update mongoDB
        const currentUser = User.findOne({userId: parentUser});
        currentUser.decks[parentDeck].push(newCard);
        currentUser.save();
        res.send("successfully created new card");
    } catch{
        res.send("error");
    }
});

//remove deck, pass in parent user ID and index of deck to use
app.post('/removedeck', async(req, res) => {
    try{
        const currentUser = User.findOne({userId: req.body.parentUser});
        currentUser.decks.splice(req.body.i, 1);
        currentUser.save();
    } catch{
        res.send("error");
    }
});

//remove card from deck, pass in parent user ID, index of deck card is in (i), and index of card (j)
app.post('/removecard', async(req, res) => {
    try{
        const currentUser = User.findOne({userId: req.body.parentUser});
        currentUser.decks[res.body.i].splice(res.body.j, 1);
        currentUser.save();
    } catch{
        res.send("error");
    }
});






app.get('/', (req, res) => {
    res.send("Hello World!");
})


app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
});




