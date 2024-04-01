/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import CommunityFlashcard from "./CommunityFlashcard";
import { FaCopy } from "react-icons/fa";
import { motion } from "framer-motion";

const CommunityDeck = ({ i, title, desc, category, communityDecks }) => {
  const modalName = `my_modal_${i}`;
  const user = useUser().user;

  const idIncrement = {
    userId: user?.id.toString(),
  };

  const [showCopyToast, setShowCopyToast] = useState(false);

  const copyDeck = () => {
    if (communityDecks.length > 0 && i < communityDecks.length) {
      const newDeck = {
        title: communityDecks[i].title,
        description: communityDecks[i].description,
        category: communityDecks[i].category,
        userId: user?.id.toString(),
        cards: communityDecks[i].cards,
        private: true,
        coppied: true,
      };

      axios
        .post(`/addDeck`, newDeck)
        .then(() => {
          // Show the copy success toast
          setShowCopyToast(true);

          // Automatically hide the toast after 10 seconds
          setTimeout(() => {
            setShowCopyToast(false);
          }, 2000);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      {/* Your copy success toast */}
      {showCopyToast && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.5 }}
          className="toast toast-end z-50"
          onClick={() => setShowCopyToast(false)}
        >
          <div className="alert alert-success hover:cursor-pointer">
            <span>Deck copied successfully.</span>
          </div>
        </motion.div>
      )}

      {/* Your existing component */}
      <li className="card card-bordered border-primary bg-base-100 shadow-xl flex flex-col">
        <button onClick={() => document.getElementById(modalName).showModal()}>
          <div className="card-body">
            <h2 className="card-title self-center text-center">{title}</h2>
            <p className="badge badge-primary badge-outline self-center text-center">
              {category}
            </p>
            <p className="self-center text-center">{desc}</p>
          </div>
        </button>
        <div>
          <button
            className="btn btn-secondary absolute right-2 bottom-2"
            onClick={copyDeck}
          >
            <FaCopy />
          </button>
        </div>
      </li>

      {communityDecks.length > 0 && i < communityDecks.length && (
        <dialog id={modalName} className="modal">
          <div className="modal-box">
            <h3 className="text-lg">
              Deck{" "}
              <span className="animate-text bg-gradient-to-r from-teal-800 via-green-700 to-blue-800 bg-clip-text text-transparent font-black">
                <b>{title}</b>
              </span>
              's cards
            </h3>
            <div className="py-4">
              {communityDecks[i] &&
              communityDecks[i].cards &&
              communityDecks[i].cards.length > 0 ? (
                <ul className="flex flex-col">
                  {communityDecks[i].cards.map((card, index) => (
                    <CommunityFlashcard
                      key={index}
                      i={index}
                      term={card.term}
                      definition={card.definition}
                    />
                  ))}
                </ul>
              ) : (
                <h2>Someone's lazy... 🤨</h2>
              )}
            </div>

            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button></button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default CommunityDeck;
