const Card = ({ post }) => {
  return (
    <div className="card">
      <div className="photo"></div>
      <div className="content">
        <p className="detail">{post["content"].slice(0, 50)}</p>
        <div className="tags">
          {post["tagname"].map((tag, index) => {
            return (
              <span key={index} className="tag">
                {tag}
              </span>
            );
          })}
        </div>
        <div className="author">
          <img src="src/assets/프로필.png" className="avatar" alt="Avatar" />
          <span className="author-name">{post["nickname"]}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
