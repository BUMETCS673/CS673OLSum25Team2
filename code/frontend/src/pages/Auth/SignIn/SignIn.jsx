import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";
import SignInImg from "../../../assets/signin_image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useGoogleLogin } from "@react-oauth/google";
import { useLogin } from "../../../hooks/Auth/useLogin";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  
  const Navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, isLoading } = useLogin();

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
          // console.log('User Info:', userInfo);
          const email = userInfo.email;
          const lastName = userInfo.family_name;
          const password = lastName.toUpperCase() + userInfo.id + email;
          await login(email, password);
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

  const signInUser = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    if (error) {
      console.log(error);
    }
    await login(email, password);
    Navigate("/mystory");
  };

  return (
    <section className="SignIn">
      <div className="signin-header">
        <h1 className="signin-h1">MY MAGICAL BEDTIME</h1>
      </div>

      <div className="signin-right">
        <div className="signin-box">
          <h2>Welcome!</h2>
          <div className="error">
            {error && <div className="error-message">{error}</div>}
          </div>
          <form className="signin-form" onSubmit={signInUser}>
            {/* zack@test.com */}
            <input type="email" placeholder="Email" className="signin-input" />
            <div className="password-wrapper">
              {/* 123456 */}
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
            <button
              disabled={isLoading}
              type="submit"
              className="signin-submit-btn"
            >
              SIGN IN
            </button>
          </form>
          <p className="signup-text">
            Don’t have an account? <Link to="/signup">Sign up</Link>
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

      <div className="signin-bottom-image">
        <img src={SignInImg} alt="Illustration" className="signin-image" />
      </div>
    </section>
  );
};

export default SignIn;
