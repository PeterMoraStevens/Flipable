import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const Deckcard = ({ i, title, desc, category, onDelete, deckPrivate, coppied }) => {
  const { user } = useUser();
  const userId = user?.id.toString();

  const [isPrivate, setIsPrivate] = useState(deckPrivate);
  const [showToast, setShowToast] = useState(false);

  const togglePrivate = async () => {
    try {
      setIsPrivate(!isPrivate);

      // Assuming your axios call is successful
      await axios.post("/updatePrivate", {
        deckNum: i,
        userId: userId,
      });

      // Show the toast
      setShowToast(true);

      // Automatically hide the toast after 10 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (error) {
      // Handle error
      console.error("Error updating private status:", error);
    }
  };

  return (
    <>
      {/* Your toast component with Framer Motion animation */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.5 }}
          className="toast toast-end"
          onClick={() => setShowToast(false)}
        >
          <div className="alert alert-success hover:cursor-pointer">
            <span>Private status updated successfully.</span>
          </div>
        </motion.div>
      )}

      {/* The rest of your component */}
      <li className="card card-bordered border-primary bg-base-100 shadow-xl flex flex-col">
        <Link to={i}>
          <div className="card-body">
            <h2 className="card-title self-center text-center">{title}</h2>
            <p className="badge badge-primary badge-outline self-center text-center">
              {category}
            </p>
            <p className="self-center text-center">{desc}</p>
          </div>
        </Link>
        <div className="flex justify-center">
          <button
            className="btn btn-error rounded m-2 p-2"
            onClick={() => onDelete(i)}
          >
            Delete
          </button>
          {!coppied && <div className="form-control self-center ml-6">
            <span className="label-text self-center">Private:</span>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="toggle toggle-warning"
                checked={isPrivate}
                onChange={togglePrivate}
              />
            </label>
          </div>}
        </div>
      </li>
    </>
  );
};

export default Deckcard;
