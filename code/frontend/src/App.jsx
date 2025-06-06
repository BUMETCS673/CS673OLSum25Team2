import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";

import "./App.css";
import { useAuthContext } from "./hooks/Auth/useAuthContext";

// Pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SighUp/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import MyStory from "./pages/MyStory/MyStory";
import GenerateStory from "./pages/GenerateStory/GenerateStory";
import Navbar from "./components/Navbar/Navbar";
function App() {
  const { user } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/generatestory"
              element={
                user ? (
                  <GenerateStory />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

             <Route
              path="/mystory"
              element={
                user ? (
                  <MyStory />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />


            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/login"
              element={!user ? <SignIn /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/signup"
              element={!user ? <SignUp /> : <Navigate to="/dashboard" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
