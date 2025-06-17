import { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/Auth/useAuthContext";
import { useLogout } from "../../hooks/Auth/useLogout";
import Logo from "../../assets/logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const location = useLocation();

  // Check if the user is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close the mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    closeMobileMenu();
    logout();
  };

  // Check if the current path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <img src={Logo} alt="logo" />
          </Link>

          <ul className={`navbar-menu ${isMobileMenuOpen ? "active" : ""}`}>
            {user && (
              <>
                <li>
                  <Link
                    to="/mystory"
                    className={`navbar-link ${
                      isActive("/mystory") ? "active" : ""
                    }`}
                    onClick={closeMobileMenu}
                  >
                    My Stories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/generatestory"
                    className={`navbar-link ${
                      isActive("/generatestory") ? "active" : ""
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Story Generator
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className={`navbar-link ${
                      isActive("/settings") ? "active" : ""
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Settings
                  </Link>
                </li>

                <li>
                  <Link
                    to="/about"
                    className={`navbar-link ${
                      isActive("/about") ? "active" : ""
                    }`}
                    onClick={closeMobileMenu}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className={`navbar-link ${
                      isActive("/contact") ? "active" : ""
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="navbar-cta navbar-cta-signout"
                    onClick={handleLogout}
                  >
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
                    className="navbar-cta navbar-cta-signin"
                    onClick={closeMobileMenu}
                  >
                    SIGN IN
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="navbar-cta navbar-cta-signup"
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
