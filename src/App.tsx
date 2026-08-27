import { useState } from "react";
import { postClick } from "./api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

export default function App() {
  const [message, setMessage] = useState("Hello from the button!");
  const [reply, setReply] = useState("Reply will appear here.");
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setReply("Waiting for backend...");
    try {
      const data = await postClick(BACKEND_URL, message);
      setReply(data.reply);
    } catch (err) {
      setReply(`Error: ${(err as Error).message}. Is the backend running?`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 480, margin: "60px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: 20 }}>button-demo-ui &rarr; button-demo-back</h1>
      <p style={{ color: "#555" }}>Click the button. The UI repo calls the backend repo's REST API.</p>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box", padding: 10, marginBottom: 12, fontSize: 14 }}
      />
      <button
        id="click-button"
        onClick={handleClick}
        disabled={loading}
        style={{ padding: "10px 18px", fontSize: 14, cursor: loading ? "default" : "pointer" }}
      >
        {loading ? "Sending..." : "Click me"}
      </button>
      <div id="reply" style={{ marginTop: 20, padding: 14, background: "#f4f4f4", borderRadius: 8, minHeight: 20 }}>
        {reply}
      </div>
      <p style={{ marginTop: 8, fontSize: 12, color: "#888" }}>Backend: {BACKEND_URL}</p>
    </main>
  );
}
