import { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthContext();
  const { logout } = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    closeMobileMenu();
    logout();
  };
  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            My Magical Bedtime
          </Link>

          <ul className={`navbar-menu ${isMobileMenuOpen ? "active" : ""}`}>
            {user && (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="navbar-link"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/story"
                    className="navbar-link"
                    onClick={closeMobileMenu}
                  >
                    Story
                  </Link>
                </li>
                <li>
                  <Link to="/" className="navbar-cta" onClick={handleLogout}>
                    SIGN OUT
                  </Link>
                </li>
              </>
            )}

            {!user && (
              <>
                <li>
                  <Link
                    to="/"
                    className="navbar-link"
                    onClick={closeMobileMenu}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="navbar-link"
                    onClick={closeMobileMenu}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="navbar-link"
                    onClick={closeMobileMenu}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="navbar-cta"
                    onClick={closeMobileMenu}
                  >
                    SIGN IN
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="navbar-cta"
                    onClick={closeMobileMenu}
                  >
                    REGISTER
                  </Link>
                </li>{" "}
              </>
            )}
          </ul>

          <button
            className={`navbar-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
