import React from "react";
import Card from "./Card";
import "./Home.css"; // 홈 화면 및 카드 그리드 스타일 로드

const Home = () => {
  return (
    <div>
      {/* 헤더 중복을 막기 위해 내부에 있던 <Header />는 제거했습니다 */}
      <main>
        <h1>Today's Post</h1>
        <div className="card-grid"></div>
        <Card />
      </main>
    </div>
  );
};

export default Home;
