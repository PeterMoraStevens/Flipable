import Navbars from "../components/Navbars";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Astro from "../assets/Astronaut-big.png";

const Invalid = () => {
  return (
    <>
      <Navbars page="landing" />
      <div
        className="hero min-h-screen bg-contain bg-no-repeat"
        style={{
          backgroundImage:
            `url(${Astro})`,
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-2xl">
            <h1 className="mb-5 text-7xl font-bold">You seem a bit lost</h1>
            <p className="mb-5 text-4xl">
              Let us help you find your way back home 🚀🌖🧑‍🚀🛰️
            </p>
            <Link className="btn btn-primary" to="/">Home</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Invalid;
