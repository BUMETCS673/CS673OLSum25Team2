import React from "react";
import "./Home.css";
import MainImage from "../../assets/main_screen_image.png";

const Home = () => {
  return (
    <section className="Home">
      <nav className="main-container">
        <button className="home-signin-btn">SIGN IN</button>
      </nav>
      <div className="main-container home-screen-container">
        <img src={MainImage} alt="Main" className="main-image" />
        <div className="home-text-overlay">
          <h1>MY MAGICAL BEDTIME</h1>
          <h3>A new adventure every night!</h3>
          <button className="home-main-btn">GENERATE A STORY</button>
        </div>
      </div>
    </section>
  );
};

export default Home;
