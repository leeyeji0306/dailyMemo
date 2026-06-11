import { Link, useNavigate } from "react-router-dom";
import "./SignInLogIn.css";
import { supabase } from "./supabase";
import { useState } from "react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function clickSignUpButton() {
    const { data: signUpeData, error: signUpError } =
      await supabase.auth.signUp({
        email: email,
        password: password,
      });

    if (signUpeData) {
      alert("회원가입을 완료했습니다!");
      const userId = signUpeData.user.id;
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: userId, nickname: name });
      navigate("/");
    }

    if (signUpError) {
      alert("회원가입에 실패하였습니다.");
      console.error(signUpError);
    }

    setName("");
    setEmail("");
    setPassword("");
  }
  return (
    <>
      <div className="container">
        <div className="left signup-planner">
          <div className="planner-line right-line"></div>

          <div className="planner-title signup-title">
            <h2>PLANNER</h2>
            <p>Daily Memo</p>
          </div>
        </div>

        <div className="right">
          <div className="form-area signup-form">
            <h1>Sign up</h1>

            <label>Name</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              type="text"
              placeholder="Enter your name"
            />

            <label>Email</label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="example@gmail.com"
            />

            <label>Password</label>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="Enter your password"
            />

            <button className="main-btn" onClick={clickSignUpButton}>
              Sign Up
            </button>

            <div className="switch-page">
              Already have an account?
              <Link to="/">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
