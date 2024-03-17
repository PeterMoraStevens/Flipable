import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbars from "../components/Navbars";
import Footer from "../components/Footer";
import CommunityDeck from "../components/CommunityDeck";

const Community = () => {
  const [communityDecksDB, setCommunityDecksDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCommunityDecks = async () => {
      try {
        const response = await axios.get("/getCommunityDecks", {
          params: {
            page: currentPage,
            limit: 12, // Adjust limit as needed
          },
        });
        setCommunityDecksDB(response.data.decks);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching community decks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityDecks();
  }, [currentPage]);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    setTimeout(() => {
      toTop();
    }, 0);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
    setTimeout(() => {
      toTop();
    }, 0);
  };

  if (loading) {
    return (
      <div className="bg-neutral">
        <Navbars page="community" />
        <div className="min-h-screen flex justify-center">
          <span className="loading loading-infinity loading-lg self-center"></span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navbars page="community" />
      <div className="bg-neutral"></div>
      <div className="min-h-screen">
        <ul className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 m-4">
          {communityDecksDB.map((deck, i) => (
            <CommunityDeck
              key={i}
              i={i}
              title={deck.title}
              desc={deck.description}
              category={deck.category}
              communityDecks={communityDecksDB}
            />
          ))}
        </ul>
        <div className="flex justify-center my-4">
          <div className="join">
            <button
              className="join-item btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              «
            </button>
            <div className="join-item btn">
              {currentPage} of {totalPages}
            </div>
            <button
              className="join-item btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Community;
