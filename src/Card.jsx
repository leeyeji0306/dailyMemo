import React from "react";

const Card = () => {
  return (
    <div className="card">
      <div className="photo"></div>
      <div className="content">
        <p className="detail">
          Hi, my name is 000. nice meet you. Hello World. Bye World
        </p>
        <div className="tags">
          <span className="tag">Happy</span>
          <span className="tag">Cook</span>
          <span className="tag">Evening</span>
        </div>
        <div className="author">
          <img src="src/assets/프로필.png" className="avatar" alt="Avatar" />
          <span className="author-name">000</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
