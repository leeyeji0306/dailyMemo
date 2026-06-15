import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // 초기 공통 초기화 스타일 (필요 없다면 지워도 무방)
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
