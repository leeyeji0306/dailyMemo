import { useState } from "react";
import Header from "./Header";
import Home from "./Home";
import Explore from "./Explore";
import Posting from "./Posting";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  // 현재 어떤 페이지를 보여줄지 결정하는 상태값입니다.
  const [page, setPage] = useState("Home");

  return (
    <>
      {/* 헤더는 이곳에서 단 한 번만 렌더링하여 고정시킵니다 */}
      <Header page={page} setPage={setPage} />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/explore" element={<Explore />}></Route>
          <Route path="/posting" element={<Posting />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
