import Navbars from "../components/Navbars";
import { SignUp } from "@clerk/clerk-react";
import { neobrutalism } from "@clerk/themes";
import Footer from "../components/Footer";

const SignUpPage = () => {
  return (
    <>
      <Navbars page="sign-up" />
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Sign Up now!</h1>
            <p className="py-6">
              We're excited to see you joining us! Thank you for taking the time
              to sign up!
            </p>
          </div>
          <SignUp
            appearance={{
              baseTheme: [neobrutalism],
              variables: {
                colorPrimary: "blue",
              },
              signIn: {
                baseTheme: [neobrutalism],
                variables: { colorPrimary: "blue" },
              },
            }}
            path="/sign-in"
            redirectUrl="/"
            signInUrl="/sign-in"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUpPage;
