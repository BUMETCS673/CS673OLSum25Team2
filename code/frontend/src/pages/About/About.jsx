import React from "react";
import "./About.css";
import SignInImg from "../../assets/signin_image.png";

const About = () => {
  return (
    <section className="About">
      <div className="about-header">
        <h1 className="about-h1">MY MAGICAL BEDTIME</h1>
      </div>

      <div className="about-right">
        <div className="about-box">
          <h2>Welcome to My Magical Bedtime</h2>
          <p>
            My Magical Bedtime is an interactive story generator designed for preschool children ages 3 to 5. 
            We help families make bedtime special with personalized, engaging stories that support early childhood development.
          </p>

          <h3>Why We Built This</h3>
          <p>
            Bedtime storytelling can be a challenge after a long day. Many parents run out of fresh ideas, and 
            screen time options often lack educational value. Our app bridges this gap by offering magical, 
            developmentally enriching stories at the tap of a button.
          </p>

          <h3>Our Purpose</h3>
          <p>
            We aim to make bedtime more meaningful. Our customizable stories promote language development, creativity, 
            emotional growth, and bonding — all through an easy-to-use, child-friendly interface.
          </p>

          <h3>Who It's For</h3>
          <p>
            Designed for parents and caregivers to enjoy with preschoolers, our app creates shared storytelling moments 
            that are both entertaining and educational.
          </p>

          <h2>Meet the Team</h2>
            <p><strong>Hongjie Zhang</strong> — Design & Implementation Lead, Security Lead</p>
            <p><strong>Tetiana Korchynska</strong> — Requirement Lead, Design & Implementation Lead</p>
            <p><strong>Iqra Chaudhary</strong> — Team Lead</p>
            <p><strong>Thomas Iliev</strong> — QA Lead</p>
            <p><strong>Grant Hovey</strong> — Configuration Lead</p>
            <p><strong>Xuelin Min</strong> — Security Lead</p>
        </div>
      </div>

      <div className="about-bottom-image">
        <img src={SignInImg} alt="Bedtime story illustration" className="about-image" />
      </div>
    </section>
  );
};

export default About;
