import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Canvas from "./pages/Canvas";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Canvas />} />
      </Routes>
    </Router>
  );
};

export default App;
