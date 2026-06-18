import Header from "./Header";
import Home from "./Home";
import Explore from "./Explore";
import Posting from "./Posting";
import Detail from "./Detail.jsx";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import DiaryEditPage from "./DiaryEditPage.jsx";
import "./App.css";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/home" element={<Home />}></Route>
        <Route path="/explore" element={<Explore />}></Route>
        <Route path="/posting" element={<Posting />}></Route>
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/edit/:id" element={<DiaryEditPage />} />
      </Routes>
    </>
  );
}
