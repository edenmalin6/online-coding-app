import { Route, Routes, Navigate } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import CodeBlockPage from "./pages/CodeBlockPage";
function App() {
  return (
    <main
      className=" bg-slate-900
    text-slate-300 min-h-screen"
    >
      <Routes>
        <Route path="/" element={<Navigate to="/lobby" />} />
        <Route path="/lobby" element={<LobbyPage/>} />
        <Route path="/code-block/:title" element={<CodeBlockPage />}  />
      </Routes>
    </main>
  );
}

export default App;
