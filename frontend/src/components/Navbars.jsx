// a component which will conditionally render our Navbar as to not require 3 different components
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { FaPlus, FaCaretLeft, FaFireAlt } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

const Navbars = ({
  page,
  flashCards,
  setFlashCards,
  flashDecks,
  setFlashcardDecks,
}) => {
  const { deckNum } = useParams();
  const navigate = useNavigate();
  const user = useUser().user;
  const userId = useUser().user?.id.toString();
  const [deckName, setDeckName] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const [priv, setPriv] = useState(false);
  const [deckCategory, setDeckCategory] = useState("Math");
  const [flashcardTerm, setFlashcardTerm] = useState("");
  const [flashcardDef, setFlashcardDef] = useState("");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    axios
      .get("/getUser", {
        params: {
          userId: userId,
        },
      })
      .then((res) => setStreak(res.currentStreak));
  }, []);

  if (page === "landing") {
    return (
      <>
        <SignedIn>
          <div className="navbar glass top-0 fixed z-50 bg-neutral">
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost text-lg text-white">
                Quizify
              </Link>
            </div>
            <Link
              to="/flashcards"
              className="btn btn-ghost text-base text-white"
            >
              Decks
            </Link>
            <Link
              to="/community"
              className="btn btn-ghost text-base text-white"
            >
              Community
            </Link>
            <span>
              <FaFireAlt color="white" /> {streak}
            </span>
            <Link to="/stats" className="btn btn-ghost text-base text-white">
              Stats
            </Link>
            <div className="flex-2 mr-2">
              <UserButton />
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <div className="navbar glass top-0 fixed z-50 bg-transparent">
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost text-lg text-white">
                Quizify
              </Link>
            </div>
            <div className="flex-2">
              <Link to="/sign-in/*" className="btn btn-ghost text-white mr-2">
                Sign In
              </Link>
            </div>
          </div>
        </SignedOut>
      </>
    );
  }

  const handleDeckTitle = (e) => {
    setDeckName(e.target.value);
  };

  const handleDeckDesc = (e) => {
    setDeckDesc(e.target.value);
  };

  const handleDeckCategory = (e) => {
    setDeckCategory(e.target.value);
  };

  const handleDeckClose = () => {
    setDeckName("");
    setDeckDesc("");
    setDeckCategory("Math");
    setPriv(false);
  };

  const handleClose = () => {
    setDeckName("");
    setDeckDesc("");
    setDeckCategory("Math");
  };

  const handleDeckAccept = () => {
    //set up axios call to add deck to backend
    const idIncrement = {
      userId: user?.id.toString(),
    };
    const newDeck = {
      title: deckName,
      description: deckDesc,
      category: deckCategory,
      userId: user?.id.toString(),
      private: priv,
    };
    console.log(flashDecks, newDeck);
    setFlashcardDecks([...flashDecks, newDeck]);
    axios.post(`/addDeck`, newDeck).catch((err) => console.log(err));
    axios.post(`/incrementDeck`, idIncrement).catch((err) => console.log(err));

    setDeckDesc("");
    setDeckName("");
    setDeckCategory("");
    setPriv(false);
  };

  if (page == "decks") {
    return (
      <div className="navbar glass top-0 fixed z-50 bg-neutral">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-lg text-white">
            Quizify
          </Link>
          <Link to="/" className="btn btn-ghost text-md text-white">
            <FaCaretLeft></FaCaretLeft>Back
          </Link>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="btn btn-ghost text-white hover:text-white"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            <FaPlus />
            Add
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box flex flex-col bg-neutral">
              <h3 className="font-bold text-lg self-center">Add New Deck</h3>
              <input
                required={true}
                value={deckName}
                type="text"
                placeholder="Deck Name"
                className="input input-bordered input-primary w-full max-w-xs self-center  mx-8 my-2 mt-4"
                onChange={handleDeckTitle}
              />
              <input
                required={true}
                value={deckDesc}
                type="text"
                placeholder="Deck Desc."
                className="input input-bordered input-primary w-full max-w-xs self-center my-2"
                onChange={handleDeckDesc}
              />
              <select
                className="select select-primary w-full max-w-xs self-center my-2"
                onChange={handleDeckCategory}
                value={deckCategory}
              >
                <option>Math</option>
                <option>Comp Sci</option>
                <option>Engineering</option>
                <option>Science</option>
                <option>Biology</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Geography</option>
                <option>Econ</option>
                <option>Physical education</option>
                <option>Drama</option>
                <option>Music</option>
                <option>Psychology</option>
                <option>Language Arts</option>
                <option>History</option>
                <option>Art</option>
              </select>
              <label htmlFor="privateCheck" className="self-center">
                Private:
              </label>
              <input
                id="privateCheck"
                type="checkbox"
                className="toggle toggle-warning self-center"
                checked={priv}
                onChange={() => {
                  setPriv(!priv);
                }}
              />
              <div className="modal-action flex">
                <form method="dialog" className="flex justify-center w-full">
                  {/* if there is a button in form, it will close the modal */}
                  <button
                    className="btn mr-8 hover:btn-error text-error font-semibold hover:text-white border border-error hover:border-transparent rounded-lg"
                    onClick={handleDeckClose}
                  >
                    Close
                  </button>
                  <button
                    className="btn ml-8 hover:btn-primary text-primary font-semibold hover:text-white border border-primary hover:border-transparent rounded-lg "
                    onClick={handleDeckAccept}
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
        <Link to="/community" className="btn btn-ghost text-base text-white">
          Community
        </Link>
        <Link to="/stats" className="btn btn-ghost text-base text-white">
          Stats
        </Link>
        <div className="flex-2 mr-2">
          <UserButton />
        </div>
      </div>
    );
  }

  const handleCardTerm = (e) => {
    setFlashcardTerm(e.target.value);
  };

  const handleCardDef = (e) => {
    setFlashcardDef(e.target.value);
  };

  const handleCardAccept = () => {
    //set up axios call to add deck to backend
    const idIncrement = {
      userId: user?.id.toString(),
    };
    const newTerm = {
      term: flashcardTerm,
      definition: flashcardDef,
      userId: user?.id.toString(),
    };
    setFlashCards([...flashCards, newTerm]);
    axios.post(`/addCard/${deckNum}`, newTerm).catch((err) => console.log(err));
    axios.post(`/incrementCard`, idIncrement).catch((err) => console.log(err));
    setFlashcardDef("");
    setFlashcardTerm("");
  };

  if (page == "flashcards") {
    return (
      <div className="navbar glass top-0 fixed z-50 bg-neutral">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-lg text-white">
            Quizify
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost text-md text-white"
          >
            <FaCaretLeft></FaCaretLeft>Back
          </button>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="btn btn-ghost text-white hover:text-white"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            <FaPlus />
            Add
          </button>
          <div className="dropdown text-white">
            <label tabIndex={0} className="btn btn-ghost">
              Practice
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow glass rounded-box w-52 bg-neutral"
            >
              <li>
                <Link to="flashcard-practice">Flashcards</Link>
              </li>
              <li>
                <Link to="test">Test</Link>
              </li>
            </ul>
          </div>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box flex flex-col bg-neutral">
              <h3 className="font-bold text-lg self-center">
                Add New Flashcard
              </h3>
              <input
                required={true}
                value={flashcardTerm}
                type="text"
                placeholder="Flashcard Term"
                className="input input-bordered input-primary w-full max-w-xs self-center  mx-8 my-4"
                onChange={handleCardTerm}
              />
              <textarea
                required={true}
                value={flashcardDef}
                placeholder="Flashcard Definition"
                className="textarea textarea-primary w-full max-w-xs self-center my-2"
                onChange={handleCardDef}
              />
              <div className="modal-action flex">
                <form method="dialog" className="flex justify-center w-full">
                  {/* if there is a button in form, it will close the modal */}
                  <button
                    className="btn mr-8 hover:btn-error text-error font-semibold hover:text-white border border-error hover:border-transparent rounded-lg"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  <button
                    className="btn ml-8 hover:btn-primary text-primary font-semibold hover:text-white border border-primary hover:border-transparent rounded-lg "
                    onClick={handleCardAccept}
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
        <Link to="/community" className="btn btn-ghost text-base text-white">
          Community
        </Link>
        <Link to="/stats" className="btn btn-ghost text-base text-white">
          Stats
        </Link>
        <div className="flex-2 mr-2">
          <UserButton />
        </div>
      </div>
    );
  }

  if (page == "flashcard-practice" || page == "test") {
    return (
      <div className="navbar glass top-0 fixed z-50 bg-neutral">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-lg text-white">
            Quizify
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost text-md text-white"
          >
            <FaCaretLeft></FaCaretLeft>Back
          </button>
        </div>
        <Link to="/stats" className="btn btn-ghost text-base text-white">
          Stats
        </Link>
        <div className="flex-none mr-2">
          <UserButton />
        </div>
      </div>
    );
  }

  if (page == "profile") {
    return (
      <div className="navbar glass top-0 fixed z-50 bg-neutral">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-lg text-white">
            Quizify
          </Link>
          <Link to="/" className="btn btn-ghost text-md text-white">
            <FaCaretLeft></FaCaretLeft>Back
          </Link>
        </div>
        <Link to="/flashcards" className="btn btn-ghost text-base text-white">
          Decks
        </Link>
        <Link to="/community" className="btn btn-ghost text-base text-white">
          Community
        </Link>
        <div className="flex-none mr-2">
          <UserButton />
        </div>
      </div>
    );
  }

  if (page == "community") {
    return (
      <div className="navbar glass top-0 fixed z-50 bg-neutral">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-lg text-white">
            Quizify
          </Link>
          <Link to="/" className="btn btn-ghost text-md text-white">
            <FaCaretLeft></FaCaretLeft>Back
          </Link>
        </div>
        <Link to="/flashcards" className="btn btn-ghost text-base text-white">
          Decks
        </Link>
        <Link to="/stats" className="btn btn-ghost text-base text-white">
          Stats
        </Link>
        <div className="flex-none mr-2">
          <UserButton />
        </div>
      </div>
    );
  }
};

export default Navbars;
