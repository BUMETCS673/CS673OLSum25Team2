import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";
import SignInImg from "../../assets/signin_image.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const signInUser = async (e) => {
    e.preventDefault();
  };
  
  return (
    <section className="SignIn">
      <div className="signin-header">
        <h1 className="signin-h1">MY MAGICAL BEDTIME</h1>
      </div>

      <div className="signin-right">
        <div className="signin-box">
          <h2>Welcome!</h2>
          <form className="signin-form" onSubmit={signInUser}>
            <input type="email" placeholder="Email" className="signin-input" />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="signin-input"
              />
              <span
                className="toggle-icon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
            <button type="submit" className="signin-submit-btn">
              SIGN IN
            </button>
          </form>
          <p className="signup-text">
            Don’t have an account? <Link to="/authentication">Sign up</Link>
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

      <div className="signin-bottom-image">
        <img src={SignInImg} alt="Illustration" className="signin-image" />
      </div>
    </section>
  );
};

export default SignIn;
