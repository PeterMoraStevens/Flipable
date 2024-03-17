import { useState, useEffect, useContext } from "react";
import { FlashcardContext } from "../App";
// import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import Navbars from "../components/Navbars";
import Footer from "../components/Footer";
import CommunityDeck from "../components/CommunityDeck";

const Community = () => {
  const { communityDecks, setCommunityDecks } = useContext(FlashcardContext);
  const [loading, setLoading] = useState(true);
  // const user = useUser().user;
  // const user_id = user?.id.toString();
  // const user_name = user.username;
  let ran = false;

  useEffect(() => {
    setLoading(true);
    axios
      .get("/getCommunityDecks")
      .then((res) => {
        setCommunityDecks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-neutral">
        <Navbars page="community"></Navbars>
        <div className="min-h-screen flex justify-center">
          <span className="loading loading-infinity loading-lg self-center"></span>
        </div>
        <Footer></Footer>
      </div>
    );
  }

  if (communityDecks.length == 0) {
    return (
      <div className="bg-neutral">
        <Navbars page="community"></Navbars>
        <div className="min-h-screen flex justify-center">
          Bruh, no one uses this site
        </div>
        <Footer></Footer>
      </div>
    );
  }

  return (
    <>
      <Navbars page="community"></Navbars>
      <div className="bg-neutral"></div>
      <div className=" min-h-screen">
        <ul className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 m-4">
          {communityDecks.map((deck, i) => (
            <CommunityDeck
              key={i}
              i={i}
              title={deck.title}
              desc={deck.description}
              category={deck.category}
              communityDecks={communityDecks}
            />
          ))}
        </ul>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Community;
