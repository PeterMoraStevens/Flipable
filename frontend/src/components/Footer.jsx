import { Link } from "react-router-dom";
import footerImg from "../assets/favicon.ico";

const Footer = () => {
  return (
    <footer className="footer p-10 bg-secondary-content text-white">
      <aside>
        <img src={footerImg} />
        <p>
          Quizify
          <br />
          Optimize your Learning
        </p>
      </aside>
      <nav className="flex flex-col">
        <header className="footer-title">Company</header>
        <Link to="/about-us">about us</Link>
        {/* <Link to="/contact-us">contact us</Link> */}
      </nav>
    </footer>
  );
};

export default Footer;
