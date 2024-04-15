import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";

const Flashcard = ({
  term,
  definition,
  onDelete,
  onEdit,
  i,
  setEditTerm,
  setEditDef,
}) => {
  return (
    <li className="flex justify-center items-center">
      <label className="swap swap-flip text-9xl ">
        <input type="checkbox" />
        <div className="card items-center text-center swap-off bg-base-100 h-64 w-80 justify-center border border-primary">
          <div className="bg-primary border border-primary rounded max-w-[80%] w-auto">
            <p className="card-title text-base-100 font-bold text-2xl ml-3 mr-3 mb-1">
              {term}
            </p>
          </div>
          <div className="flex justify-center">
            <button
              className="m-2 btn btn-neutral rounded self-center justify-center text-center"
              onClick={() => {
                onEdit(i);
                setEditTerm(term);
                setEditDef(definition);
              }}
            >
              <FaEdit color="white" className="text-xl translate-x-[2px]" />
            </button>

            <button
              className="btn btn-error rounded m-2"
              onClick={() => onDelete(i)}
            >
              <FaTrashAlt className="text-lg" color="white" />
            </button>
          </div>
        </div>
        <div className="card items-center text-center swap-on bg-base-100 h-64 w-80 flex justify-center border border-primary overflow-auto">
          <div className="max-w-full pt-6">
            <p className="text-2xl m-4 whitespace-normal break-words">
              {definition}
            </p>
          </div>
        </div>
      </label>
    </li>
  );
};

export default Flashcard;
