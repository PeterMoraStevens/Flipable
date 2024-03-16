import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Navbars from "../components/Navbars";
import Footer from "../components/Footer";
import { FlashcardContext } from "../App";
import Flashcard from "../components/Flashcard";
import Invalid from "./Invalid";

const FlashcardDeck = () => {
  const { flashCards, setFlashCards } = useContext(FlashcardContext);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  let ran = false;
  const user = useUser().user;
  const user_id = user?.id.toString();
  const { deckNum } = useParams();

  useEffect(() => {
    if (!ran) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ran = true;
      setLoading(true);
      axios
        .get(`/getFlashcards/${deckNum}`, {
          params: {
            userId: user_id,
          },
        })
        .then((res) => {
          setFlashCards(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setInvalid(true);
        });
    }
  }, []);

  const handleDeleteFlashcard = (index) => {
    axios
      .delete("/deleteCard", {
        params: {
          deckNum: deckNum,
          i: index,
          userId: user?.id.toString(),
        },
      })
      .then(() => {
        setFlashCards((prevFlashCards) =>
          prevFlashCards.filter((_, i) => i !== index)
        );
      })
      .catch((err) => console.log(err));
  };

  // if no cards, output empty cards
  if (invalid) {
    return <Invalid />;
  }

  if (loading) {
    return (
      <div className="bg-neutral">
        <Navbars
          page="flashcards"
          flashCards={flashCards}
          setFlashCards={setFlashCards}
        ></Navbars>
        <div className="min-h-screen flex justify-center">
          <span className="loading loading-infinity loading-lg self-center"></span>
        </div>
        <Footer></Footer>
      </div>
    );
  }

  if (flashCards.length === 0) {
    return (
      <>
        <Navbars
          page="flashcards"
          flashCards={flashCards}
          setFlashCards={setFlashCards}
        ></Navbars>
        <div className="hero min-h-screen bg-neutral">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">No Cards?</h1>
              <p className="py-6 text-4xl">
                Press <b>Add</b> to add a new flashcard!
              </p>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </>
    );
  }

  return (
    <>
      <Navbars
        page="flashcards"
        flashCards={flashCards}
        setFlashCards={setFlashCards}
      ></Navbars>
      <div className="bg-neutral"></div>
      <div className="min-h-screen flex justify-center items-start mb-8">
        <ul className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 m-4">
          {flashCards.map((card, i) => (
            <Flashcard
              key={i}
              i={i}
              term={card.term}
              definition={card.definition}
              onDelete={handleDeleteFlashcard}
            />
          ))}
        </ul>
      </div>
      <Footer></Footer>
    </>
  );
};

export default FlashcardDeck;
