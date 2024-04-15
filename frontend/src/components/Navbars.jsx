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
  const userId = user?.id.toString();
  const [deckName, setDeckName] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const [priv, setPriv] = useState(true);
  const [deckCategory, setDeckCategory] = useState("Math");
  const [flashcardTerm, setFlashcardTerm] = useState("");
  const [flashcardDef, setFlashcardDef] = useState("");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (userId) {
      axios
        .get("/getUser", {
          params: {
            userId: userId,
          },
        })
        .then((res) => setStreak(res.data.currentStreak))
        .catch((error) => console.error("Error fetching user:", error));

      axios.post("/updateUsername", {
        userName: user.username.toString(),
        userId: userId,
      });
    }
  }, [userId]); // Only re-run the effect if userId changes

  if (page === "sign-up" || page === "sign-in") {
    return (
      <div className="w-full navbar glass bg-content">
        <Link to="/" className="btn btn-ghost text-base text-white">
          Quizify
        </Link>
      </div>
    );
  }

  if (page === "landing") {
    return (
      <>
        <SignedIn>
          <div className="drawer z-50">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
              {/* Navbar */}
              <div className="w-full navbar glass bg-content">
                <div className="flex-none lg:hidden">
                  <label
                    htmlFor="my-drawer-3"
                    aria-label="open sidebar"
                    className="btn btn-square btn-ghost"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-6 h-6 stroke-current"
                      color="white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </label>
                </div>
                <div className="flex-1">
                  <Link to="/" className="btn btn-ghost text-lg text-white">
                    Quizify
                  </Link>
                </div>
                <div className="flex-none hidden lg:block">
                  <ul className="menu menu-horizontal flex-2">
                    {/* Navbar menu content here */}
                    <li>
                      <Link
                        to="/flashcards"
                        className="btn btn-ghost text-base text-white"
                      >
                        Decks
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/community"
                        className="btn btn-ghost text-base text-white"
                      >
                        Community
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/stats"
                        className="btn btn-ghost text-base text-white"
                      >
                        Stats
                      </Link>
                    </li>
                    <li>
                      <span className="text-base text-white items-center justify-center btn-disabled">
                        <FaFireAlt color="white" />
                        {streak}
                      </span>
                    </li>
                    <div className="self-center justify-center -translate-y-1">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </ul>
                </div>
              </div>
              {/* Page content here */}
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer-3"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu p-4 w-80 min-h-full glass z-50 bg-neutral flex flex-col items-center">
                {/* Sidebar content here */}
                <li>
                  <Link
                    to="/flashcards"
                    className="btn btn-ghost text-base text-white"
                  >
                    Decks
                  </Link>
                </li>
                <li>
                  <Link
                    to="/community"
                    className="btn btn-ghost text-base text-white"
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    to="/stats"
                    className="btn btn-ghost text-base text-white"
                  >
                    Stats
                  </Link>
                </li>
                <li>
                  <span className="text-base text-white items-center justify-center btn-disabled">
                    <FaFireAlt color="white" />
                    {streak}
                  </span>
                </li>
                <div className="self-center justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </ul>
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
    setPriv(true);
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
    setFlashcardDecks([...flashDecks, newDeck]);
    axios.post(`/addDeck`, newDeck).catch((err) => console.log(err));
    axios.post(`/incrementDeck`, idIncrement).catch((err) => console.log(err));

    setDeckDesc("");
    setDeckName("");
    setDeckCategory("");
    setPriv(true);
  };

  if (page == "decks") {
    return (
      <div className="drawer z-50">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="w-full navbar glass bg-content">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                  color="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost text-lg text-white">
                Quizify
              </Link>

              <dialog id="my_modal_1" className="modal">
                <div className="modal-box flex flex-col bg-neutral">
                  <h3 className="font-bold text-lg self-center">
                    Add New Deck
                  </h3>
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
                    <form
                      method="dialog"
                      className="flex justify-center w-full"
                    >
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

            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal flex-2 self-center justify-center">
                {/* Navbar menu content here */}
                <li>
                  <Link to="/" className="btn btn-ghost text-base text-white">
                    <FaCaretLeft></FaCaretLeft>Back
                  </Link>
                </li>
                <li>
                  <button
                    className="btn btn-ghost text-white text-base hover:text-white"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    <FaPlus />
                    Add
                  </button>
                </li>
                <li>
                  <Link
                    to="/community"
                    className="btn btn-ghost text-base text-white"
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    to="/stats"
                    className="btn btn-ghost text-base text-white"
                  >
                    Stats
                  </Link>
                </li>
                <li>
                  <div className="text-base text-white">
                    <FaFireAlt /> {streak}
                  </div>
                </li>
                <div className="self-center justify-center -translate-y-1">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </ul>
            </div>
          </div>
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full glass z-50 bg-neutral flex flex-col text-base">
            {/* Sidebar content here */}
            <li>
              <Link to="/" className="btn btn-ghost text-base text-white">
                <FaCaretLeft></FaCaretLeft>Back
              </Link>
            </li>
            <li>
              <button
                className="btn btn-ghost text-white text-base"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                <FaPlus />
                Add
              </button>
            </li>
            <li>
              <Link
                to="/community"
                className="btn btn-ghost text-base text-white"
              >
                Community
              </Link>
            </li>
            <li>
              <Link to="/stats" className="btn btn-ghost text-base text-white">
                stats
              </Link>
            </li>
            <div className="self-center justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </ul>
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
      <div className="drawer z-50">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="w-full navbar glass bg-content">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                  color="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost text-lg text-white">
                Quizify
              </Link>

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
                    <form
                      method="dialog"
                      className="flex justify-center w-full"
                    >
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
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal flex-2 items-center justify-center">
                {/* Navbar menu content here */}
                <li>
                  <Link
                    to="/flashcards"
                    className="btn btn-ghost text-base text-white"
                  >
                    <FaCaretLeft></FaCaretLeft>Back
                  </Link>
                </li>
                <li>
                  <button
                    className="btn btn-ghost text-white hover:text-white text-base"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    <FaPlus />
                    Add
                  </button>
                </li>

                <div className="dropdown text-white ">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost text-base -translate-y-[3px]"
                  >
                    Practice
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow glass rounded-box w-52 bg-neutral text-base"
                  >
                    <li>
                      <Link to="flashcard-practice">Flashcards</Link>
                    </li>
                    <li>
                      <Link to="test">Test</Link>
                    </li>
                  </ul>
                </div>

                <li>
                  <Link
                    to="/flashcards"
                    className="btn btn-ghost text-base text-white"
                  >
                    Decks
                  </Link>
                </li>
                <li>
                  <Link
                    to="/community"
                    className="btn btn-ghost text-base text-white"
                  >
                    Community
                  </Link>
                </li>
                <div className="text-base text-white self-center -translate-y-[3px] items-center justify-center flex flex-row">
                  <FaFireAlt className="my-4 mx-2" /> {streak}
                </div>
                <div className="self-center justify-center -translate-y-[3px] ml-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </ul>
            </div>
          </div>
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full glass z-50 bg-neutral flex flex-col text-base">
            {/* Sidebar content here */}
            <li>
              <Link
                to="/flashcards"
                className="btn btn-ghost text-base text-white"
              >
                <FaCaretLeft></FaCaretLeft>Back
              </Link>
            </li>
            <li>
              <button
                className="btn btn-ghost text-white text-base hover:text-white"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                <FaPlus />
                Add
              </button>
            </li>
            <li>
              <div className="dropdown text-white justify-center">
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
            </li>
            <li>
              <Link
                to="/community"
                className="btn btn-ghost text-base text-white"
              >
                Community
              </Link>
            </li>
            <div className="text-base text-white self-center items-center justify-center flex flex-row">
              <FaFireAlt className="my-4 mx-2" /> {streak}
            </div>

            <li>
              <Link to="/stats" className="btn btn-ghost text-base text-white">
                stats
              </Link>
            </li>

            <div className="self-center justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </ul>
        </div>
      </div>
    );
  }

  if (page == "flashcard-practice" || page == "test") {
    return (
      <div className="drawer z-50">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="w-full navbar glass bg-content">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                  color="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost text-lg text-white">
                Quizify
              </Link>
            </div>
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal flex-2 self-center justify-center">
                {/* Navbar menu content here */}
                <li>
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost text-base text-white"
                  >
                    <FaCaretLeft></FaCaretLeft>Back
                  </button>
                </li>
                <div className="text-base text-white -translate-y-1 items-center justify-center flex flex-row">
                  <FaFireAlt className="my-4 mx-2" /> {streak}
                </div>
                <li>
                  <Link
                    to="/stats"
                    className="btn btn-ghost text-base text-white"
                  >
                    Stats
                  </Link>
                </li>
                <div className="self-center justify-center -translate-y-[3px]">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </ul>
            </div>
          </div>
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full glass z-50 bg-neutral flex flex-col">
            {/* Sidebar content here */}
            <li>
              <button
                onClick={() => navigate(-1)}
                className="btn btn-ghost text-base text-white"
              >
                <FaCaretLeft></FaCaretLeft>Back
              </button>
            </li>
            <li>
              <Link to="/stats" className="btn btn-ghost text-base text-white">
                Stats
              </Link>
            </li>
            <div className="text-base text-white -translate-y-1 items-center justify-center flex flex-row">
              <FaFireAlt className="my-4 mx-2" /> {streak}
            </div>
            <div className="self-center justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </ul>
        </div>
      </div>
    );
  }

  if (page == "profile") {
    return (
      <div className="drawer z-50">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="w-full navbar glass bg-content">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                  color="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost text-lg text-white">
                Quizify
              </Link>
            </div>
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal flex-2 self-center justify-center">
                {/* Navbar menu content here */}
                <li>
                  <Link to="/" className="btn btn-ghost text-base text-white">
                    <FaCaretLeft />
                    Back
                  </Link>
                </li>
                <li>
                  <Link
                    to="/flashcards"
                    className="btn btn-ghost text-base text-white"
                  >
                    Decks
                  </Link>
                </li>
                <li>
                  <Link
                    to="/community"
                    className="btn btn-ghost text-base text-white"
                  >
                    Community
                  </Link>
                </li>
                <div className="text-base text-white -translate-y-1 items-center justify-center flex flex-row">
                  <FaFireAlt className="my-4 mx-2" /> {streak}
                </div>
                <div className="self-center justify-center -translate-y-[3px] ml-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </ul>
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full glass z-50 bg-neutral flex flex-col">
            {/* Sidebar content here */}
            <li>
              <Link to="/" className="btn btn-ghost text-base text-white">
                <FaCaretLeft></FaCaretLeft>Back
              </Link>
            </li>
            <li>
              <Link
                to="/flashcards"
                className="btn btn-ghost text-base text-white"
              >
                Decks
              </Link>
            </li>
            <li>
              <Link
                to="/community"
                className="btn btn-ghost text-base text-white"
              >
                Community
              </Link>
            </li>
            <div className="text-base text-white -translate-y-1 items-center justify-center flex flex-row">
              <FaFireAlt className="my-4 mx-2" /> {streak}
            </div>
            <div className="self-center justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </ul>
        </div>
      </div>
    );
  }

  if (page == "community") {
    return (
      <div className="drawer z-50">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="w-full navbar glass bg-content">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                  color="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost text-lg text-white">
                Quizify
              </Link>
            </div>
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal flex-2">
                {/* Navbar menu content here */}
                <li>
                  <Link to="/" className="btn btn-ghost text-base text-white">
                    <FaCaretLeft />
                    Back
                  </Link>
                </li>
                <li>
                  <Link
                    to="/flashcards"
                    className="btn btn-ghost text-base text-white"
                  >
                    Decks
                  </Link>
                </li>
                <li>
                  <Link
                    to="/stats"
                    className="btn btn-ghost text-base text-white"
                  >
                    Stats
                  </Link>
                </li>
                <div className="text-base text-white -translate-y-1 items-center justify-center flex flex-row">
                  <FaFireAlt className="my-4 mx-2" /> {streak}
                </div>
                <div className="self-center justify-center ml-4 -translate-y-[3px]">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </ul>
            </div>
          </div>
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full glass z-50 bg-neutral flex flex-col">
            {/* Sidebar content here */}
            <li>
              <Link to="/" className="btn btn-ghost text-base text-white">
                <FaCaretLeft></FaCaretLeft>Back
              </Link>
            </li>
            <li>
              <Link
                to="/flashcards"
                className="btn btn-ghost text-base text-white"
              >
                Decks
              </Link>
            </li>
            <li>
              <Link to="/stats" className="btn btn-ghost text-base text-white">
                Stats
              </Link>
            </li>
            <div className="text-base text-white -translate-y-1 items-center justify-center flex flex-row">
              <FaFireAlt className="my-4 mx-2" /> {streak}
            </div>
            <div className="self-center justify-center ml-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </ul>
        </div>
      </div>
    );
  }
};

export default Navbars;
