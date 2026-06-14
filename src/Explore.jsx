import React from "react";
import Card from "./Card";
import "./Explore.css"; // 둘러보기 화면 전용 스타일 로드

const Explore = () => {
  return (
    <div>
      {/* 헤더 중복을 막기 위해 내부에 있던 <Header />는 제거했습니다 */}
      <main>
        <h1 className="Exh1">Explore</h1>
        <div className="card-grid"></div>
        <Card />
      </main>
    </div>
  );
};

export default Explore;
