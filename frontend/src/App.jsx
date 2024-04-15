import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { neobrutalism, dark } from "@clerk/themes";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import { useState, createContext } from "react";
import Landing from "./routes/Landing";
import ScrollTop from "./components/ScrollTop";
import Invalid from "./routes/Invalid";
import "./index.css";
import Decks from "./routes/FlashcardDecks";
import FlashcardDeck from "./routes/FlashcardDeck";
import FlashcardsPractice from "./routes/FlashcardsPractice";
import Decktest from "./routes/Decktest";
import AboutUs from "./routes/AboutUs";
import ContactUs from "./routes/ContactUs";
import Stats from "./routes/Stats";
import Community from "./routes/Community";
import SignUpPage from "./routes/SignUp";
import SignInPage from "./routes/SignIn";

// we now have context for each componenet wanting to get access to flashcardDecks and flashcards
export const FlashcardContext = createContext();

const ClerkRoutes = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const navigate = useNavigate();
  const [flashDecks, setFlashcardDecks] = useState([]);
  const [flashCards, setFlashCards] = useState([]);
  const [communityDecks, setCommunityDecks] = useState([]);

  return (
    <FlashcardContext.Provider
      value={{
        flashDecks,
        setFlashcardDecks,
        flashCards,
        setFlashCards,
        communityDecks,
        setCommunityDecks,
      }}
    >
      <ClerkProvider
        publishableKey={clerkPubKey}
        navigate={(to) => navigate(to)}
        appearance={{
          baseTheme: [neobrutalism],
          variables: {
            colorPrimary: "green",
          },
          signIn: {
            baseTheme: [neobrutalism],
            variables: { colorPrimary: "blue" },
          },
        }}
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/sign-in/*"
            element={<SignInPage routing="path" path="/sign-in" />}
          />
          <Route
            path="/sign-up/*"
            element={<SignUpPage routing="path" path="/sign-up" />}
          />
          <Route
            path="/flashcards"
            element={
              <>
                <SignedIn>
                  <Decks />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/flashcards/:deckNum"
            element={
              <>
                <SignedIn>
                  <FlashcardDeck />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/flashcards/:deckNum/flashcard-practice"
            element={
              <>
                <SignedIn>
                  <FlashcardsPractice />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/flashcards/:deckNum/test"
            element={
              <>
                <SignedIn>
                  <Decktest />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/community"
            element={
              <>
                <SignedIn>
                  <Community />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route path="/about-us" element={<AboutUs></AboutUs>}></Route>
          {/* <Route path="/contact-us" element={<ContactUs></ContactUs>}></Route> */}
          <Route
            path="/stats"
            element={
              <>
                <SignedIn>
                  <Stats />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route path="*" element={<Invalid />}></Route>
        </Routes>
      </ClerkProvider>
    </FlashcardContext.Provider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollTop />
      <ClerkRoutes />
    </BrowserRouter>
  );
};

export default App;
