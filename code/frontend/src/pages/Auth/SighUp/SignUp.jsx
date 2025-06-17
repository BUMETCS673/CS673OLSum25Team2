import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.css";
import SignInImg from "../../../assets/signin_image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useGoogleLogin } from "@react-oauth/google";
import { useSignUp } from "../../../hooks/Auth/useSignUp";
import { useNavigate } from 'react-router-dom';
const SignUp = () => {
  const Navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { signup, error, isLoading } = useSignUp();

  const signUpHandler = (e) => {
    e.preventDefault();
    const email = e.target[2].value;
    const password = e.target[3].value;
    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    // console.log(email, password, firstName, lastName);
    signup(email, password, firstName, lastName);
    Navigate("/mystory")
    if (error) {
      console.log(error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Token Response:", tokenResponse);

      try {
        // Fetch user info using the access token
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );

        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          // console.log("User Info:", userInfo);
          const email = userInfo.email;
          const firstName = userInfo.given_name;
          const lastName = userInfo.family_name;
          const password = lastName.toUpperCase() + userInfo.id + email;
          await signup(email, password, firstName, lastName);
          Navigate("/mystory");

        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });
  return (
    <section className="SignUp">
      <div className="signup-header">
        <h1 className="signup-h1">MY MAGICAL BEDTIME</h1>
      </div>
      <div className="signup-right">
        <div className="signup-box">
          <h2>Sign Up</h2>
          <div className="error">
            {error && <div className="error-message">{error}</div>}
          </div>
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
            <button
              disabled={isLoading}
              type="submit"
              className="signup-submit-btn"
            >
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
          <button className="google-btn" onClick={() => googleLogin()}>
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
