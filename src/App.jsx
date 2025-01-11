import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Canvas from "./pages/Canvas";
import Session from "./pages/Session";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Canvas />} />
        <Route path="/room/:id" element={<Session />} />
      </Routes>
    </Router>
  );
};

export default App;
