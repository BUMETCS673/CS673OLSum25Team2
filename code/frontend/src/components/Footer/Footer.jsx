import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import "./Footer.css";

const Footer = () => {
  return (
    <section className="Footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Link to="/">
            <img src={Logo} alt="logo"/>
          </Link>
        </div>

        <div className="footer-columns-wrapper">
          <div className="footer-column">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-column">
            <Link to="/mystory">My Stories</Link>
            <Link to="/generatestory">Generate a Story</Link>
            <Link to="/settings">Settings</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} My Magical Bedtime. All rights reserved.
      </div>
    </section>
  );
};

export default Footer;
