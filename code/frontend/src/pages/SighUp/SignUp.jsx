import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.css";
import SignInImg from "../../assets/signin_image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

import { useSignUp } from "../../hooks/useSignUp";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {signup, error, isLoading} = useSignUp();

  const signUpHandler = (e) => {
    e.preventDefault();
    const email = e.target[2].value;
    const password = e.target[3].value;
    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    console.log(email, password, firstName, lastName);
    signup(email, password, firstName, lastName);
    if(error) {
      console.log(error);
    }
  }
  return (
    <section className="SignUp">
      <div className="signup-header">
        <h1 className="signup-h1">MY MAGICAL BEDTIME</h1>
      </div>

      <div className="signup-right">
        <div className="signup-box">
          <h2>Sign Up</h2>
          <form className="signup-form" onSubmit={signUpHandler}>
            <input
              type="text"
              placeholder="First Name"
              className="signup-input"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="signup-input"
            />
            <input type="email" placeholder="Email" className="signup-input" />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="signup-input"
              />
              <span
                className="toggle-icon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
            <button disabled={isLoading} type="submit" className="signup-submit-btn">
              SIGN UP
            </button>
          </form>
          <p className="signup-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
          <div className="divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>
          <button className="google-btn">
            <FontAwesomeIcon icon={faGoogle} className="icon" />
            Continue with Google
          </button>
        </div>
      </div>

      <div className="signup-bottom-image">
        <img src={SignInImg} alt="Illustration" className="signup-image" />
      </div>
    </section>
  );
};

export default SignUp;
