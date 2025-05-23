import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter
} from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SighUp/SignUp";
import StoryRenderingView from "./pages/StoryRenderingView";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<h1>Parental Controls</h1>} />
            <Route path="/reading" element={<h1>Reading Experience</h1>} />
            <Route path="/profiles" element={<h1>Profiles</h1>} />
            <Route path="/story" element={StoryRenderingView} />
            <Route path="/login" element={<SignIn/>} />
            <Route path="/signup" element={<SignUp/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
