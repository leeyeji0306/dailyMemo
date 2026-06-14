import React from "react";
import "./Posting.css"; // 게시물 작성 화면 전용 스타일 로드

const Posting = () => {
  return (
    <div>
      {/* 헤더 중복을 막기 위해 내부에 있던 <Header />는 제거했습니다 */}
      <main>
        <div className="posting-wrap">
          <div className="posting-box">
            <div className="posting-header">
              <span className="posting-title">새 게시물 만들기</span>
              <button className="share">공유하기</button>
            </div>
            <div className="posting-body">
              <div className="posting-photo"></div>
              <div className="posting-right">
                <div className="posting-content">
                  <div className="posting-author">
                    <img
                      src="src/assets/프로필.png"
                      className="posting-avatar"
                      alt="Avatar"
                    />
                    <span className="posting-name">000</span>
                  </div>
                  <textarea
                    className="posting-text"
                    placeholder="(본문 내용 넣기)"
                  ></textarea>
                </div>
                <div className="posting-tags">
                  <input type="text" placeholder="#" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Posting;
