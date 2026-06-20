import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import PublicProfile from "./pages/PublicProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />    

        <Route path="/register" element={<Register />}/>

        <Route path="/dashboard" element={<Dashboard />} />

       <Route path="/:handle" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 