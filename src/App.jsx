import Header from "./Header";
import Home from "./Home";
import Explore from "./Explore";
import Posting from "./Posting";
import Detail from "./Detail.jsx";
import "./App.css";
import { Routes, Route } from "react-router-dom";

export default function App() {
  let userName = "이예지";
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/explore" element={<Explore />}></Route>
        <Route
          path="/posting"
          element={<Posting userName={userName} />}
        ></Route>
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </>
  );
}
