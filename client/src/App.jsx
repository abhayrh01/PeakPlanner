import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">HOME</Link>
        <Link to="/notes">NOTES</Link>
        <Link to="/tasks">TO-DO</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
}
