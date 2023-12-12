import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI(process.env.OPENAI_API_KEY);

//Syntax for getting models response: completion.choices[0].message.content

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

let realDefs = ["a greeting", "a farewell"];
let testDefs = ["A way to great someone", "A banana"];
let terms = ["hello", "goodbye"];

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

// var score =  await gradeTest(realDefs, testDefs, terms);
// console.log(score)

export default { gradeTest };
