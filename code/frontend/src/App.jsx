import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import "./App.css";
import { useAuthContext } from "./hooks/Auth/useAuthContext";

// Pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SighUp/SignUp";
import Settings from "./pages/Settings/Settings";
import MyStory from "./pages/MyStory/MyStory";
import GenerateStory from "./pages/GenerateStory/GenerateStory";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import LoginRequired from "./components/LoginRequired/LoginRequired";

function AppContent() {
  const { user } = useAuthContext();
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <div className="pages">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/generatestory"
            element={user ? <GenerateStory /> : <LoginRequired pageName="Story Generator" user={user}/>}
          />
          <Route
            path="/mystory"
            element={user ? <MyStory /> : <LoginRequired  pageName="My Stories" user={user}/>}
          />
          <Route
            path="/settings"
            element={user ? <Settings /> : <LoginRequired  pageName="Settings" user={user}/>}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
