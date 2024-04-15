import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Navbars from "../components/Navbars";
import Footer from "../components/Footer";
import { FlashcardContext } from "../App";
import Flashcard from "../components/Flashcard";
import Invalid from "./Invalid";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";

const FlashcardDeck = () => {
  const { flashCards, setFlashCards } = useContext(FlashcardContext);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [currentDeleteIndex, setCurrentDeleteIndex] = useState(-1);
  const [currentEditIndex, setCurrentEditIndex] = useState(-1);
  const [editTerm, setEditTerm] = useState("");
  const [editDef, setEditDef] = useState("");
  const [update, setUpdate] = useState(false);
  const user = useUser().user;
  const user_id = user?.id.toString();
  const { deckNum } = useParams();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [update, deckNum, user_id]);

  const handleDeleteFlashcard = (index) => {
    // check before delete

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

  const handleEditFlashcard = (index) => {
    axios
      .post(`/editCard/${deckNum}`, {
        cardTerm: editTerm,
        cardDef: editDef,
        cardIndex: index,
        userId: user_id,
      })
      .then(() => {
        setUpdate((prev) => !prev);
      });

    setEditDef("");
    setEditTerm("");
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
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="edit-flashcard" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">You're about to edit your card</h3>
          <p className="py-4">
            Only click confirm if you're absolutely sure you want the new
            content
          </p>
          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Term"
              className="input input-bordered input-primary w-full max-w-sm mb-2"
              value={editTerm}
              onChange={(e) => setEditTerm(e.target.value)}
            />
            <textarea
              className="textarea textarea-primary w-full max-w-sm mt-2"
              placeholder="Defintion"
              value={editDef}
              onChange={(e) => setEditDef(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}

              <button className="btn hover:btn-success text-success font-semibold hover:text-white border border-success hover:border-transparent rounded-lg">
                <FaCircleXmark />
              </button>
              <button
                className="btn ml-4 hover:btn-error text-error font-semibold hover:text-white border border-error hover:border-transparent rounded-lg"
                onClick={() => handleEditFlashcard(currentEditIndex)}
              >
                <FaCheckCircle />
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="delete-flashcard" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Watch out!</h3>
          <p className="py-4">
            Are you absolutely sure you want to delete this card? It will be
            unrecoverable!
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}

              <button className="btn hover:btn-success text-success font-semibold hover:text-white border border-success hover:border-transparent rounded-lg">
                <FaCircleXmark color="success" />
              </button>
              <button
                className="btn ml-4 hover:btn-error text-error font-semibold hover:text-white border border-error hover:border-transparent rounded-lg"
                onClick={() => handleDeleteFlashcard(currentDeleteIndex)}
              >
                <FaTrashAlt color="error" />
              </button>
            </form>
          </div>
        </div>
      </dialog>
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
              onDelete={() => {
                document.getElementById("delete-flashcard").showModal();
                setCurrentDeleteIndex(i);
              }}
              onEdit={() => {
                document.getElementById("edit-flashcard").showModal();
                setCurrentEditIndex(i);
              }}
              setEditTerm={setEditTerm}
              setEditDef={setEditDef}
            />
          ))}
        </ul>
      </div>
      <Footer></Footer>
    </>
  );
};

export default FlashcardDeck;
