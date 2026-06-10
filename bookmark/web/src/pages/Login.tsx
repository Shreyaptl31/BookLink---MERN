import { useState } from "react";
import API from "../api/api";

interface Props {
  setToken: (token: string) => void;
}

export default function Login({ setToken }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.session.access_token;

      localStorage.setItem("token", token);
      setToken(token);
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}
