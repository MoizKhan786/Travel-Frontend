import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import TourApp from "./TourApp";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TourApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
