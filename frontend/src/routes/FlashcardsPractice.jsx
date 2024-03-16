import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { FlashcardContext } from "../App";
import { useNavigate } from "react-router-dom";
import Navbars from "../components/Navbars";
import Footer from "../components/Footer";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function FlashcardsPractice() {
  const navigate = useNavigate();
  const { flashCards, setFlashCards } = useContext(FlashcardContext);
  const [deck, setDeck] = useState([...flashCards]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [moveState, setMoveState] = useState("swap swap-flip text-9xl");
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(1);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const user = useUser().user;
  const user_id = user?.id.toString();
  const { deckNum } = useParams();

  let ran = false;

  useEffect(() => {
    if (!ran) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ran = true;
      axios
        .get(`/getFlashcards/${deckNum}`, {
          params: {
            userId: user_id,
          },
        })
        .then((res) => {
          setFlashCards(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const canAddBack = deck.length === 1;

  const handleAddBackToDeck = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setMoveState(
      "animate-fade-right animate-once animate-ease-in-out animate-reverse swap swap-flip text-9xl"
    );
    const shuffledDeck = [...deck];
    const removedCard = shuffledDeck.splice(currentCardIndex, 1)[0];
    const randomIndex = Math.floor(Math.random() * (shuffledDeck.length - 1));
    shuffledDeck.splice(randomIndex, 0, removedCard);

    setTimeout(() => {
      setDeck(shuffledDeck);
      setIsCardFlipped(false);
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % shuffledDeck.length);
    }, 650);

    setTimeout(() => {
      setMoveState(
        "animate-jump-in animate-once animate-ease-in-out swap swap-flip text-9xl"
      );
      setTimeout(() => {
        setMoveState("swap swap-flip text-9xl");
        setIsAnimating(false);
      }, 325);
    }, 650);
  };

  const handleGotItRight = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setMoveState(
      "animate-fade-left animate-once animate-ease-in-out animate-reverse swap swap-flip text-9xl"
    );
    const updatedDeck = [...deck];
    updatedDeck.splice(currentCardIndex, 1);
    setProgress(updatedDeck.length / flashCards.length);

    setTimeout(() => {
      setDeck(updatedDeck);
      setIsCardFlipped(false);
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % updatedDeck.length);
    }, 650);

    setTimeout(() => {
      setMoveState(
        "animate-jump-in animate-once animate-ease-in-out swap swap-flip text-3xl w-96 md:w-64 lg:w-80 xl:w-96"
      );
      setTimeout(() => {
        setMoveState("swap swap-flip text-9xl");
        setIsAnimating(false);
      }, 325);
    }, 650);
  };

  const reset = () => {
    setCurrentCardIndex(0);
    setDeck([...flashCards]);
    setProgress(flashCards.length);
  };

  if (flashCards.length === 0) {
    return (
      <>
        <Navbars page="flashcard-practice"></Navbars>
        <div className="hero min-h-screen bg-neutral">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hey nothing here?</h1>
              <p className="py-6">
                If you want to practice, go back and add some cards!
              </p>
              <button onClick={() => navigate(-1)} className="btn btn-primary">
                Go Back
              </button>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </>
    );
  }

  if (deck.length === 0) {
    return (
      <>
        <Navbars page="flashcard-practice"></Navbars>
        <div className="hero min-h-screen bg-neutral">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Nice job!</h1>
              <p className="py-6">
                Now that you&rsquo;ve reached the end of the deck, you can
                return back if you&rsquo;re done or press the <b>Restart</b>{" "}
                button to continue!
              </p>
              <button onClick={reset} className="btn btn-primary">
                Restart
              </button>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </>
    );
  }

  return (
    <>
      <Navbars page="flashcard-practice"></Navbars>
      <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <h1 className=" font-thin text-3xl">Welcome to Practice</h1>
        <div
          className="tooltip mt-1 mb-2 tooltip-secondary tooltip-right"
          data-tip="Number of Cards Left"
        >
          <progress
            className="progress progress-accent w-48"
            value={progress}
            max="1"
          ></progress>
        </div>
        {deck.length > 0 && (
          <div className="flex flex-col items-center justify-center top-40">
            <label className={moveState}>
              <input
                type="checkbox"
                checked={isCardFlipped}
                onChange={() => setIsCardFlipped(!isCardFlipped)}
              />
              <div className="card items-center text-center swap-off bg-base-100 h-64 w-80 justify-center border border-primary">
                <div className="bg-primary border border-primary rounded">
                  <p className="card-title text-base-100 font-bold text-2xl ml-3 mr-3 mb-1">
                    {deck[currentCardIndex].term}
                  </p>
                </div>
              </div>
              <div className="card items-center text-center swap-on bg-base-100 h-64 w-80 flex justify-center border border-primary overflow-auto">
                <div className="max-w-full pt-6">
                  <p className="text-2xl m-4 whitespace-normal break-words">
                    {deck[currentCardIndex].definition}
                  </p>
                </div>
              </div>
            </label>
          </div>
        )}
        <div className="flex justify-center mt-4">
          {deck.length > 0 && (
            <>
              <button
                onClick={handleAddBackToDeck}
                disabled={canAddBack}
                className="btn btn-primary mr-4"
              >
                <FaCaretLeft /> Add back to deck
              </button>
              <button onClick={handleGotItRight} className="btn btn-primary">
                Got it right <FaCaretRight />
              </button>
            </>
          )}
        </div>
        <div className="mt-20"></div>
      </div>

      <Footer></Footer>
    </>
  );
}

export default FlashcardsPractice;
