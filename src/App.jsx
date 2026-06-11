import { useState } from "react";
import Header from "./Header";
import Home from "./Home";
import Explore from "./Explore";
import Posting from "./Posting";
import "./App.css";

export default function App() {
  // 현재 어떤 페이지를 보여줄지 결정하는 상태값입니다.
  const [page, setPage] = useState("Home");

  return (
    <>
      {/* 헤더는 이곳에서 단 한 번만 렌더링하여 고정시킵니다 */}
      <Header page={page} setPage={setPage} />

      {/* page 상태값에 따라 본문 영역 컴포넌트만 동적으로 교체됩니다 */}
      {page === "Home" && <Home />}
      {page === "Explore" && <Explore />}
      {page === "Posting" && <Posting />}
    </>
  );
}
