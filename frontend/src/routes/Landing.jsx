import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbars from "../components/Navbars";
import Footer from "../components/Footer";
import about from "../assets/undraw_moonlight_-5-ksn.svg";
import { TypeAnimation } from "react-type-animation";
import landingimg from "../assets/undraw_team_work_k-80-m.svg";
import lost from "../assets/lost.png";
import found from "../assets/through_the_park.png";
import { InfiniteMovingCards } from "../components/infiniteCards";

const testimonials = [
  {
    quote:
      "I used Quizify and I felt super prepared for my final. The flashcards made studying feel more engaging, plus it's free!",
    name: "Zagros R.",
    title: "Oregon State Univeristy Alumni",
  },
  {
    quote: "This is the best upcoming quiz app!",
    name: "Sebastian T.",
    title: "Current Oregon State Univeristy Student",
  },
  {
    quote:
      "Quizify is one of the most exciting new study apps being developed right now!",
    name: "Peter M.",
    title: "Current Oregon State Univeristy Student",
  },
  {
    quote:
      "I love Quizify's streak functionality! It encourages me to keep studying leading up to a final.",
    name: "Annette T.",
    title: "Current Oregon State Univeristy Student",
  },
];

const Landing = () => {
  const slideInFromLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={slideInFromLeft}
      className="flex flex-col items-center bg-neutral"
    >
      <Navbars page={"landing"}></Navbars>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={slideInFromLeft}
        className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12"
      >
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="py-3 text-5xl">
            Welcome to{" "}
            <span className="animate-text bg-gradient-to-r from-teal-800 via-green-700 to-blue-800 bg-clip-text text-transparent font-black">
              Quizify
            </span>
            !
          </h1>
          <h2>
            <TypeAnimation
              sequence={[
                "Optimize your learning",
                2000,
                "Truly understand the content",
                2000,
                "Better than memorization",
                2000,
                "Flexible Definitions",
                2000,
              ]}
              wrapper="span"
              speed={40}
              style={{ fontSize: "2em", display: "inline-block" }}
              repeat={Infinity}
            />
          </h2>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            Revolutionize learning with our innovative flashcards. Say goodbye
            to pure memorization and embrace true understanding for a more
            effective and enjoyable learning experience!
          </p>
          <Link to="/flashcards" className="btn btn-primary">
            Get Started
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideInFromRight}
          className="hidden lg:mt-0 lg:col-span-5 lg:flex"
        >
          <img src={landingimg} alt="studying friends" />
        </motion.div>
      </motion.section>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={slideInFromLeft}
        className="mb-24"
      >
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={slideInFromRight}
        className="hero min-h-screen"
        style={{
          backgroundImage: `url(${about})`,
        }}
      >
        <div className="hero-overlay bg-opacity-0"></div>
        <div className="hero-content text-center text-gray-300">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              Learn More About Quizify!
            </h1>
            <p className="mb-5"></p>
            <Link to="/about-us" className="btn btn-primary">
              Learn more
            </Link>
          </div>
        </div>
      </motion.div>
      <Footer></Footer>
    </motion.div>
  );
};

export default Landing;
