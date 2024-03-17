/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { PiExamThin, PiCardsFill } from "react-icons/pi";
import { useUser } from "@clerk/clerk-react";
import Navbars from "../components/Navbars";
import Footer from "../components/Footer";
// import Loading from "../components/Loading";
import axios from "axios";

function Stats() {
  const { user } = useUser();
  const username = user.username;
  const userImg = user.imageUrl;
  const [deckCount, setDeckCount] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [cardCount, setCardCount] = useState(0);
  const [topUsers, setTopUsers] = useState({});

  useEffect(() => {
    axios
      .get("/getUser", {
        params: {
          userId: user.id.toString(),
        },
      })
      .then((res) => {
        setDeckCount(res.data.decksCreated);
        setTestCount(res.data.testsTaken);
        setCardCount(res.data.cardsCreated);
      })
      .catch((err) => console.log(err));

    axios
      .get("/getTopStreakUsers", {
        params: {
          userId: user.id.toString(),
        },
      })
      .then((res) => {
        setTopUsers(res.data);
      });
  }, []);

  // add useEffects for getting and updating user stats from the DB

  // conditional rendering for when user's data is being called

  return (
    <div>
      <Navbars page={"profile"}></Navbars>
      {topUsers.length > 0 ? (
        <div className="hero min-h-screen">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="max-w-2xl">
              <h1 className="text-7xl">
                Welcome{" "}
                <span className="text-primary">
                  <b>{username}</b>
                </span>
                !
              </h1>
              <p className="py-6 text-3xl">
                Here are some of your statistics! We're excited to see how you
                grow!
              </p>

              <div className="flex flex-col sm:flex-row">
                <div className="stats stats-vertical shadow mb-4 sm:mb-0 sm:mr-4 flex-grow">
                  <div className="stat">
                    <div className="stat-figure text-primary text-6xl">
                      <PiExamThin />
                    </div>
                    <div className="stat-title">Total Test Taken</div>
                    <div className="stat-value text-primary">{testCount}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-secondary text-6xl">
                      <PiCardsFill />
                    </div>
                    <div className="stat-title">Flashcards Created</div>
                    <div className="stat-value text-secondary">{cardCount}</div>
                  </div>

                  <div className="stat items-center">
                    <div className="stat-figure text-secondary">
                      <div className="avatar online">
                        <div className="w-16 rounded-full">
                          <img src={userImg} />
                        </div>
                      </div>
                    </div>
                    <div className="stat-value">{deckCount}</div>
                    <div className="stat-title">Decks Created</div>
                  </div>
                </div>
                <div className="overflow-x-auto flex-grow text-white border rounded-3xl">
                  <table className="table bg-red-300 text-base font-semibold">
                    {/* head */}
                    <thead>
                      <tr className="text-white text-base">
                        <th>#</th>
                        <th>Name</th>
                        <th>Longest Streak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* row 1 */}
                      <tr className="bg-success">
                        <th>1</th>
                        <td>{topUsers[0].userName}</td>
                        <td>{topUsers[0].longestStreak}</td>
                      </tr>
                      {/* row 2 */}
                      <tr>
                        <th>2</th>
                        <td>{topUsers[1].userName}</td>
                        <td>{topUsers[1].longestStreak}</td>
                      </tr>
                      {/* row 3 */}
                      <tr>
                        <th>3</th>
                        <td>{topUsers[2].userName}</td>
                        <td>{topUsers[2].longestStreak}</td>
                      </tr>
                      <tr>
                        <th>4</th>
                        <td>{topUsers[3].userName}</td>
                        <td>{topUsers[3].longestStreak}</td>
                      </tr>
                      <tr>
                        <th>...</th>
                        <td>...</td>
                        <td>...</td>
                      </tr>
                      <tr>
                        <th>Yours</th>
                        <td>{topUsers[4].userName}</td>
                        <td>{topUsers[4].longestStreak}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hero min-h-screen flex justify-center items-center">
          <p>Loading...</p>
        </div>
      )}
      <Footer></Footer>
    </div>
  );
}

export default Stats;
