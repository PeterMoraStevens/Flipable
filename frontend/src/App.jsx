import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import { useState, createContext } from "react";
import Landing from "./routes/Landing";
import ScrollTop from "./components/ScrollTop";
import Invalid from "./routes/Invalid";
import "./index.css";
import Decks from "./routes/FlashcardDecks";
import Flashcards from "./routes/FlashcardDeck";

// we now have context for each componenet wanting to get access to flashcardDecks and flashcards
export const FlashcardContext = createContext();

const ClerkRoutes = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const navigate = useNavigate();
  const [flashDecks, setFlashcardDecks] = useState([{title: "CS290", desc: "web development", category: "Comp Sci"}, {title: "CS261", desc: "data structures", category: "Comp Sci"}]);
  const [flashCards, setFlashCards] = useState([]);

  return (
    <FlashcardContext.Provider
      value={{ flashDecks, setFlashcardDecks, flashCards, setFlashCards }}
    >
      <ClerkProvider
        publishableKey={clerkPubKey}
        navigate={(to) => navigate(to)}
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/sign-in/*"
            element={<SignIn routing="path" path="/sign-in" />}
          />
          <Route
            path="/sign-up/*"
            element={<SignUp routing="path" path="/sign-up" />}
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
            path="/flashcards/:deck_num"
            element={
              <>
                <SignedIn>
                  <Flashcards />
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
