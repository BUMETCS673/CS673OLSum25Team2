import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SighUp/SignUp";
import { useAuthContext } from "./hooks/useAuthContext";
import Dashboard from "./pages/Dashboard/Dashboard";
import Story from "./pages/Story/Story";

function App() {
  const { user } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/reading"
              element={
                user ? <h1>Reading Experience</h1> : <Navigate to="/login" />
              }
            />
            <Route
              path="/profiles"
              element={user ? <h1>Profiles</h1> : <Navigate to="/login" />}
            />
            <Route
              path="/story"
              element={user ? <Story />: <Navigate to="/login" />}
            />
            
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
