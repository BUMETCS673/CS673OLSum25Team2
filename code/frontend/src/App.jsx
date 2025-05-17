import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/dashboard" element={<h1>Parental Controls</h1>} />
            <Route path="/reading" element={<h1>Reading Experience</h1>} />
            <Route path="/profiles" element={<h1>Profiles</h1>} />
            <Route path="/story" element={<h1>Story Management</h1>} />
            <Route path="/authentication" element={<h1>Authentication Module</h1>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
