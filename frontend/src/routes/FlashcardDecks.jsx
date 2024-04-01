import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { FlashcardContext } from "../App";
import Footer from "../components/Footer";
import Navbars from "../components/Navbars";
import Deckcard from "../components/Deckcard";
const FlashcardDecks = () => {
  let ran = false;
  const [loading, setLoading] = useState(true);
  const user = useUser().user;
  const user_id = user?.id.toString();

  const { flashDecks, setFlashcardDecks } = useContext(FlashcardContext);

  useEffect(() => {
    if (!ran) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ran = true;
      setLoading(true);
      axios
        .get("/getDecks", {
          params: {
            userId: user_id,
          },
        })
        .then((res) => {
          setFlashcardDecks(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [setFlashcardDecks]);

  const handleDeleteDecks = (index) => {
    axios
      .delete("/deleteDecks", {
        params: {
          deckNum: index,
          userId: user_id,
        },
      })
      .then(() => {
        setFlashcardDecks((prevFlashCards) =>
          prevFlashCards.filter((_, i) => i !== parseInt(index))
        );
      })
      .catch((err) => console.log(err));
    console.log(index);
  };

  if (loading) {
    return (
      <div className="bg-neutral">
        <Navbars
          page="decks"
          flashDecks={flashDecks}
          setFlashcardDecks={setFlashcardDecks}
        ></Navbars>
        <div className="min-h-screen flex justify-center">
          <span className="loading loading-infinity loading-lg self-center"></span>
        </div>
        <Footer></Footer>
      </div>
    );
  }

  if (flashDecks.length === 0) {
    return (
      <>
        <Navbars
          page="decks"
          flashDecks={flashDecks}
          setFlashcardDecks={setFlashcardDecks}
        ></Navbars>
        <div className="hero min-h-screen bg-neutral">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">No Decks?</h1>
              <p className="py-6 text-4xl">
                Press <b>Add</b> to add a new deck!
              </p>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </>
    );
  }

  return (
    <div className="bg-neutral">
      <Navbars
        page="decks"
        flashDecks={flashDecks}
        setFlashcardDecks={setFlashcardDecks}
      ></Navbars>
      <div className="bg-neutral"></div>
      <div className=" min-h-screen">
        <ul className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 m-4">
          {flashDecks.map((deck, i) => (
            <Deckcard
              key={i}
              i={i.toString()}
              title={deck.title}
              desc={deck.description}
              category={deck.category}
              onDelete={handleDeleteDecks}
              deckPrivate={deck.private}
              coppied={deck.coppied}
            />
          ))}
        </ul>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default FlashcardDecks;
