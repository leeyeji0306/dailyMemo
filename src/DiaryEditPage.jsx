import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DiaryEditPage.css";
import defaultProfile from "/src/assets/프로필.png";
import { supabase } from "./supabase";

export default function DiaryEditPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 이전 페이지에서 넘어온 원본 데이터 파싱
  const passedPost = location.state?.post;
  const diaryId = passedPost?.id; // 수정할 일기의 고유 ID

  // 세션이나 로컬스토리지에서 현재 로그인한 유저 정보 가져오기
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // 💡 [수정/삭제 권한 체크 판별기]
  // 글에 적힌 user_id와 내 로그인 ID가 일치하면 진짜 주인(isOwner = true)
  const isOwner = passedPost?.user_id === userId;

  // 초기 상태 설정
  const [content, setContent] = useState(passedPost?.content || "");

  // [태그 정제 장치] 넘어온 태그가 쉼표나 배열 형태더라도 input창에는 '#일상 #코딩' 형태로 예쁘게 출력되도록 포맷팅
  const initialTags = passedPost?.tags
    ? (Array.isArray(passedPost.tags)
        ? passedPost.tags
        : passedPost.tags
            .split(/[#,]/)
            .map((t) => t.trim())
            .filter(Boolean)
      )
        .map((t) => `#${t}`)
        .join(" ")
    : "";

  const [tags, setTags] = useState(initialTags);
  const [imageURL, setImageURL] = useState(
    passedPost?.imageUrl || passedPost?.photo_url || "",
  );
  const [rawFile, setRawFile] = useState(null); // 새롭게 선택한 파일 객체
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false); // 삭제 모달 토글

  // 이미지 변경 핸들러
  const handleImageChange = (e) => {
    // 💡 남의 글이면 사진 클릭해도 반응 없게 막기
    if (!isOwner) return;

    const file = e.target.files[0];
    if (!file) return;
    setRawFile(file);
    setImageURL(URL.createObjectURL(file));
  };

  // 💾 [수정하기] 버튼 클릭 핸들러
  const handleSave = async () => {
    // 🚨 [보안 잠금] 남의 글이면 수정 요청 차단!
    if (!isOwner) {
      alert("본인이 작성한 글만 수정할 수 있습니다. ⛔");
      return;
    }

    const postDate = passedPost?.date;
    let finalStorageURL = imageURL;

    // [1단계] 사진을 새로 바꿨다면 스토리지에 새 파일 업로드
    if (rawFile) {
      const fileExt = rawFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `diaries_images/${fileName}`;

      const { data: imageSaveData, error: imageSaveError } =
        await supabase.storage.from("photos").upload(filePath, rawFile);

      if (imageSaveError) {
        console.error("스토리지 수정 업로드 실패:", imageSaveError);
        alert("새 사진 저장에 실패했습니다.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      finalStorageURL = publicUrlData.publicUrl;
    }

    // [2단계] diaries 테이블 업데이트
    let query = supabase
      .from("diaries")
      .update({
        content: content,
        photo_url: finalStorageURL,
      })
      .eq("user_id", userId);

    if (diaryId) {
      query = query.eq("id", diaryId);
    } else if (postDate) {
      query = query.eq("date", postDate);
    } else {
      alert("수정에 필요한 최소한의 정보가 없습니다.");
      return;
    }

    const { data: updatedRows, error: diariesUpdateError } =
      await query.select();

    if (diariesUpdateError || !updatedRows || updatedRows.length === 0) {
      console.error("게시글 수정 실패:", diariesUpdateError);
      alert("게시글 수정 권한이 없거나 오류가 발생했습니다.");
      return;
    }

    // [3단계] 태그 데이터 정제 및 동기화 처리
    const activeDiaryId = diaryId || updatedRows?.[0]?.id;

    if (activeDiaryId) {
      let resultTags = tags
        .split(/[#,]/)
        .map((tag) => tag.trim())
        .filter(Boolean);

      await supabase.from("diary_tags").delete().eq("diary_id", activeDiaryId);

      const finalTagIds = [];

      for (const tag of resultTags) {
        const { data: existingTag, error: findError } = await supabase
          .from("tags")
          .select("id")
          .eq("name", tag);

        if (existingTag && existingTag.length > 0) {
          finalTagIds.push(existingTag[0].id);
        } else {
          const { data: newTagData, error: tagsError } = await supabase
            .from("tags")
            .insert({ name: tag })
            .select();

          if (!tagsError && newTagData) {
            finalTagIds.push(newTagData[0].id);
          }
        }
      }

      if (finalTagIds.length > 0) {
        const mappingRows = finalTagIds.map((tId) => ({
          diary_id: activeDiaryId,
          tag_id: tId,
        }));
        await supabase.from("diary_tags").insert(mappingRows);
      }
    }

    alert("게시물이 성공적으로 수정되었습니다! 🎉");
    navigate("/home");
  };

  // 🗑️ [삭제하기] 실제 동작 핸들러
  const handleDeleteConfirm = async () => {
    // 🚨 [보안 잠금] 남의 글이면 삭제 요청 차단!
    if (!isOwner) {
      alert("본인이 작성한 글만 삭제할 수 있습니다. ⛔");
      setShowConfirmDiscard(false);
      return;
    }

    const postDate = passedPost?.date;

    try {
      if (diaryId) {
        await supabase.from("diary_tags").delete().eq("diary_id", diaryId);
        await supabase
          .from("diaries")
          .delete()
          .eq("id", diaryId)
          .eq("user_id", userId);
      } else if (postDate) {
        const { data: targetDiary } = await supabase
          .from("diaries")
          .select("id")
          .eq("user_id", userId)
          .eq("date", postDate);

        const fetchedId = targetDiary?.[0]?.id;

        if (fetchedId) {
          await supabase.from("diary_tags").delete().eq("diary_id", fetchedId);
        }
        await supabase
          .from("diaries")
          .delete()
          .eq("user_id", userId)
          .eq("date", postDate);
      } else {
        alert("삭제할 게시물의 정보가 불충분합니다.");
        return;
      }

      alert("게시물이 삭제되었습니다.");
      setShowConfirmDiscard(false);
      navigate("/home");
    } catch (err) {
      console.error("삭제 중 예기치 못한 에러:", err);
      alert("삭제 처리에 실패했습니다.");
    }
  };

  return (
    <div>
      <main>
        <div className="posting-wrap">
          <div className="posting-box">
            <div className="posting-header">
              <button
                className="btn-memo-back"
                onClick={() => navigate(-1)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ←
              </button>
              <span className="posting-title">
                {isOwner ? "게시물 수정하기" : "게시물 상세보기"}
              </span>

              {/* 💡 내가 쓴 글일 때만 우측 상단에 '수정하기' 버튼이 작동함 (남의 글이면 안내 메시지) */}
              <button
                className="share"
                onClick={
                  isOwner
                    ? handleSave
                    : () => alert("본인 글만 수정할 수 있습니다.")
                }
                style={{ opacity: isOwner ? 1 : 0.5 }}
              >
                수정하기
              </button>
            </div>
            <div className="posting-body">
              <div className="posting-photo">
                {imageURL ? (
                  <label
                    htmlFor={isOwner ? "file-input" : ""} // 💡 내가 쓴 글일 때만 파일 인풋 연결
                    className="upload-placeholder"
                    style={{
                      padding: 0,
                      cursor: isOwner ? "pointer" : "default",
                    }}
                  >
                    <img
                      src={imageURL}
                      alt="업로드된 이미지"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </label>
                ) : (
                  <label
                    htmlFor={isOwner ? "file-input" : ""}
                    className="upload-placeholder"
                  >
                    <span>+</span>
                    <p>사진이 없습니다</p>
                  </label>
                )}

                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  disabled={!isOwner} // 💡 남의 글이면 파일 선택창 차단
                />
              </div>

              <div className="posting-right">
                <div className="posting-content">
                  <div className="posting-author">
                    <img
                      src={defaultProfile}
                      className="posting-avatar"
                      alt="Avatar"
                    />
                    <span className="posting-name">
                      {passedPost?.nickname || "익명 유저"}
                    </span>
                  </div>
                  <textarea
                    className="posting-text"
                    placeholder="(본문 내용)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    readOnly={!isOwner} // 💡 남의 글이면 글자 수정 못 하게 읽기 전용 모드 활성화
                  ></textarea>
                </div>
                <div className="posting-tags">
                  <input
                    type="text"
                    placeholder="#태그"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    readOnly={!isOwner} // 💡 남의 글이면 태그도 수정 불가능
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🚨 내가 쓴 글(isOwner === true)일 때만 하단 삭제 구역 렌더링하기 */}
        {isOwner && (
          <div
            className="memo-danger-area"
            style={{
              marginTop: "20px",
              width: "100%",
              maxWidth: "950px",
              display: "flex",
              justifyContent: "flex-end",
              margin: "20px auto 0",
            }}
          >
            <button
              className="btn-memo-delete"
              onClick={() => setShowConfirmDiscard(true)}
              style={{
                background: "none",
                border: "1px solid #d94f3a",
                color: "#d94f3a",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              이 게시물 삭제하기
            </button>
          </div>
        )}
      </main>

      {/* ⚠️ 삭제 확인 팝업 모달 */}
      {showConfirmDiscard && (
        <div
          className="overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            className="modal"
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              width: "280px",
              textAlign: "center",
            }}
          >
            <p
              className="modal-title"
              style={{ fontWeight: "bold", marginBottom: "8px" }}
            >
              정말 삭제할까요?
            </p>
            <p
              className="modal-desc"
              style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}
            >
              삭제된 일기는 복구할 수 없어요.
            </p>
            <div
              className="modal-actions"
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
            >
              <button
                className="btn-cancel"
                onClick={() => setShowConfirmDiscard(false)}
                style={{
                  background: "#eee",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                취소
              </button>
              <button
                className="btn-confirm-delete"
                onClick={handleDeleteConfirm}
                style={{
                  background: "#d94f3a",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
