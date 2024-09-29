// app css
import "./App.css";
// components
import Home from "../components/Home/Home";
import Navbar from "../components/Navbar/Navbar";
import Speech from "../components/Speech/Speech";
import CreateNew from "../components/CreateNew/CreateNew";
//route
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <div className="main-content"></div>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/Home/:id" Component={Home} />
        <Route path="/CreateNew" Component={CreateNew} />
        <Route path="/Speech/:speaker/:id" Component={Speech} />
      </Routes>
    </>
  );
}

export default App;
