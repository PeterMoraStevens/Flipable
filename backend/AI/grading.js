const dotenv = require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

//Syntax for getting models response: completion.choices[0].message.content
/*You are a helpful assistant who evaluates the similarity between two definitions. You are given the correct definition of a term and a definition given by a Human. You are to determine if the definition given by the Human provides a core understanding of the correct definition. These definitions do not need to match. 
/n/nExamples:
/nDefinition 1: The process of making a material or object have a shiny surface by rubbing it.
/nDefinition 2: The act of rubbing an object to make it shiny. 
/nDo the definitions match?
/nYes
/n/nDefinition 1: A person who is trained to treat people who are ill or injured.
/nDefinition 2: A person who helps people who are sick or injured.
/nDo the definitions match?
/nYes





*/
async function grade(def1, def2, word) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant who evaluates the similarity between two definitions. You are given the correct definition of a term and a definition given by a Human. You are to determine if the definition given by the Human provides a core understanding of the correct definition. These definitions do not need to match. ",
      }, // Prompt introduction
      // {
      //   role: "user",
      //   content: `I'm presenting two definitions for the term "${word}", the first definition is the correct definition. The second definition is given by a Human.`,
      // },
      { role: "assistant", content: `Definition 1, this is the correct definition: ${def1}` },
      { role: "assistant", content: `Definition 2, this is the definition given by the Human: ${def2}` },
      {
        role: "system",
        content: `Compare the two definitons, if the definition given by the Human is grasps the core understanding of the correct definition, output 'yes', even with potential syntactic differences, and 'no' if their meanings significantly differ. Focus on capturing the essence of their definitions rather than strict syntactical matching.`,
      },
      //Few shot examples
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


async function gradeTest(realDefs, testDefs) {
  console.log("starting grading");
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

module.exports = {
  gradeTest: gradeTest,
};
