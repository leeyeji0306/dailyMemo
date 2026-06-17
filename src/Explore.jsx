import Card from "./Card";
import "./Explore.css"; // 둘러보기 화면 전용 스타일 로드
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const Explore = () => {
  // 💡 1. 데이터를 저장하고 화면을 새로고침해줄 상태(state) 선언
  const [posts, setPosts] = useState([]);

  // 💡 2. 데이터 로딩 함수를 컴포넌트 내부의 정상적인 위치로 이동
  const postLoading = async () => {
    try {
      // 💡 쉼표 오타를 완전히 깔끔하게 제거한 Supabase 쿼리!
      const { data: postData, error: postError } = await supabase
        .from("diaries")
        .select(
          `
          id, 
          photo_url,
          content,
          date,
          profiles (
            id,
            nickname
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (postError) throw postError;

      let tempPosts = [];

      // 일기 데이터가 있으면 태그를 매핑해서 채워 넣음
      if (postData) {
        for (let post of postData) {
          const { data: tagsData, error: tagsError } = await supabase
            .from("diary_tags")
            .select(
              `
              tags (
                name
              )
            `,
            )
            .eq("diary_id", post.id);

          if (tagsError) {
            console.error("태그를 불러오지 못했습니다 ㅠ.ㅠ", tagsError);
            continue;
          }

          // 💡 구조 분해 할당 에러 방지를 위한 안전 장치 처리
          const nickname = post.profiles ? post.profiles.nickname : "익명";

          // tagsData 구조 안에서 순수한 태그 이름 문자열 배열만 뽑아내는 map 로직 수정
          // tagsData 예시: [{ tags: { name: "일상" } }, { tags: { name: "코딩" } }]
          const tags_name = tagsData
            ? tagsData.map((t) => t.tags && t.tags.name).filter(Boolean)
            : [];
          tempPosts.push({
            id: post.id,
            nickname: nickname,
            photo_url: post.photo_url,
            content: post.content,
            date: post.date,
            tags_name: tags_name,
          });
        }
      }

      // 💡 3. 가공이 끝난 임시 배열을 진짜 상태(State)에 집어넣어 화면을 그리게 만듦!
      setPosts(tempPosts);
    } catch (error) {
      console.error("전체 포스트 로딩 중 오류 발생:", error.message);
    }
  };

  // 💡 4. useEffect는 함수 안이 아니라 이렇게 컴포넌트 최상단에 떡하니 배치해야 함!
  useEffect(() => {
    const init = async () => {
      await postLoading();
    };
    init();
  }, []); // 의존성 배열을 비워두어 컴포넌트가 켜질 때 딱 한 번만 실행되도록 보장!
  return (
    <div>
      <main>
        <h1 className="Exh1">Explore</h1>
        <div className="card-grid">
          {posts.map((post) => {
            return (
              <Link to={`/detail/${post.id}`} state={{ postData: post }}>
                <Card key={post.id} post={post} />
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Explore;
