// app css
import "./App.css";
// components
import Home from "./components/Home";
import Navbar from "./components/Navbar/Navbar";
import Speech from "./components/Speech";
//route
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/Speech/:speaker/:id" Component={Speech} />
      </Routes>
    </>
  );
}

export default App;
