import Navbars from "../components/Navbars";
import Footer from "../components/Footer";
import { FlashcardContext } from "../App";
import { useContext } from "react";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import DeckcardTest from "../components/DeckcardTest";
import TestNumbers from "../components/TestNumbers";
import Loading from "../components/Loading";
import axios from "axios";

const Decktest = () => {
  const user = useUser().user;
  const user_id = user?.id.toString();
  const { flashCards } = useContext(FlashcardContext);
  const [graded, setGraded] = useState(false);
  const [gradingNow, setGradingNow] = useState(false);
  var randomFlash = [...flashCards]; //copy the flash card deck
  for (var i = 0; i < randomFlash.length; i++) {
    // randomize flashcards
    const j = Math.floor(Math.random() * (i + 1));
    [randomFlash[i], randomFlash[j]] = [randomFlash[j], randomFlash[i]];
  }
  const [realDef, setRealDef] = useState(randomFlash);
  const [answers, setAnswers] = useState([]);
  const [correct, setCorrect] = useState(
    Array.from({ length: flashCards.length }, () => -1)
  );
  const [numQ, setNumQ] = useState(-1); //going to test adding different length of tests
  const [qUpdate, setQUpdate] = useState(false);
  const [modalClosed, setModalClose] = useState(false);
  const [renderedQs, setRenderedQs] = useState(false);
  const [numCorrect, setNumCorrect] = useState(0);

  const handleAccept = (e) => {
    const n = document.getElementById("numQuestions");
    if (n.value > 0 && n.value <= flashCards.length) {
      setNumQ(n.value);
      const initialAnswers = Array.from({ length: n.value }, () => "");
      setAnswers(initialAnswers);
    } else {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const modal = document.getElementById("my_modal_test");

    if (modal) {
      modal.showModal();
    }
  }, []);

  useEffect(() => {
    if (numQ >= 0) {
      setRealDef(randomFlash.slice(0, numQ));
      setQUpdate(true);
      setModalClose(true);
      setRenderedQs(true);
    }
  }, [numQ]);

  const handleSumbit = async () => {
    console.log("submitting: ", answers);
    console.log("testCards: ", realDef);
    setGradingNow(true);
    // Testcards contains the terms and definitons in correct order
    // answer contains the answers in the order they were answered
    try {
      axios.post("/incrementTests", { userId: user_id });
      const response = await axios.post("/test", { realDef, answers });
      console.log(response.data);
      setCorrect(response.data.slice(0, response.data.length - 1));
      setGradingNow(false);
      setGraded(true);
      setNumCorrect(response.data[response.data.length - 1]);
    } catch (err) {
      console.log(err);
    }
  };

  if (randomFlash.length === 0) {
    return (
      <>
        <Navbars page="test"></Navbars>
        <div className="hero min-h-screen bg-neutral">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">No Cards?</h1>
              <p className="py-6 text-4xl">
                Go back to the <b>flashcard page</b> and click add!
              </p>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </>
    );
  } else if (gradingNow) {
    return (
      <div className="bg-neutral">
        <Navbars page="test"></Navbars>
        <div className="bg-neutral"></div>
        <Loading />
        <Footer></Footer>
      </div>
    );
  } else {
    return (
      <div className="bg-neutral">
        <Navbars page="test"></Navbars>
        <div className="bg-neutral"></div>
        {!modalClosed && <Loading />}
        <dialog id="my_modal_test" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <div className="flex flex-row">
              <p className="py-4 mr-5">
                How many questions would you like? Max: {flashCards.length}{" "}
              </p>
              <input
                id="numQuestions"
                type="text"
                placeholder="Type here"
                className="input input-bordered input-secondary w-1/4 max-w-xs"
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-secondary" onClick={handleAccept}>
                  accept
                </button>
              </form>
            </div>
          </div>
        </dialog>
        {modalClosed && qUpdate && (
          <div className=" min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-5">
              Time to{" "}
              <span className="animate-text bg-gradient-to-r from-teal-800 via-green-700 to-blue-800 bg-clip-text text-transparent font-black">
                Quizify
              </span>
              !
            </h1>
            {graded && (
              <div
                className="radial-progress"
                style={{
                  "--value": Math.floor((numCorrect / correct.length) * 100),
                }}
                role="progressbar"
              >
                {Math.floor((numCorrect / correct.length) * 100)}%
              </div>
            )}
            <div
              className="flex flex-nowrap overflow-x-auto"
              style={{ maxWidth: "50%" }}
            >
              {realDef.map((card, i) => (
                <TestNumbers key={i} scrollTo={`element${i}`} index={i + 1} />
              ))}
            </div>
            {renderedQs && (
              <ul className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4 m-4">
                {realDef.map((card, i) => (
                  <DeckcardTest
                    id={`element${i}`}
                    key={i}
                    index={i}
                    term={card.term}
                    setCorrect={setCorrect}
                    correct={correct}
                    answers={answers}
                    setAnswers={setAnswers}
                    domEleID={`element${i}`}
                    realDefs={realDef}
                    setNumCorrect={setNumCorrect}
                    numCorrect={numCorrect}
                  />
                ))}
              </ul>
            )}

            {!graded && (
              <button
                className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-success mb-20 w-[50%]"
                onClick={handleSumbit}
              >
                Submit
              </button>
            )}
          </div>
        )}

        <Footer></Footer>
      </div>
    );
  }
};

export default Decktest;
