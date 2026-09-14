import { useState } from "react";
import { postClick } from "./api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";
const INITIAL_REPLY = "Reply will appear here.";

export default function App() {
  const [message, setMessage] = useState("Hello from the button!");
  const [reply, setReply] = useState(INITIAL_REPLY);
  const [loading, setLoading] = useState(false);
  const hasResponse = reply !== INITIAL_REPLY && !loading;
  const hasError = hasResponse && reply.startsWith("Error:");

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
    <main className="demo-shell">
      <style>{`
        :root {
          color: #321f17;
          background: #f3e4d0;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        body {
          margin: 0;
          min-width: 320px;
          background:
            radial-gradient(circle at top left, rgba(255, 248, 232, 0.92), transparent 36rem),
            linear-gradient(135deg, #f6ead7 0%, #c49b73 52%, #6f412b 100%);
        }

        button,
        input {
          font: inherit;
        }

        .demo-shell {
          box-sizing: border-box;
          min-height: 100vh;
          padding: 44px 20px;
          display: grid;
          place-items: center;
        }

        .demo-panel {
          width: min(940px, 100%);
          border: 1px solid rgba(87, 50, 32, 0.22);
          border-radius: 28px;
          padding: clamp(22px, 4vw, 40px);
          background: rgba(255, 246, 232, 0.86);
          box-shadow: 0 28px 80px rgba(58, 31, 19, 0.28), inset 0 1px rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(14px);
        }

        .demo-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          margin-bottom: 30px;
        }

        h1 {
          margin: 0;
          font-size: clamp(30px, 5vw, 56px);
          line-height: 0.98;
          letter-spacing: 0;
          color: #3a2118;
        }

        .demo-header p {
          max-width: 310px;
          margin: 6px 0 0;
          color: #71513f;
          line-height: 1.55;
        }

        .process-map {
          display: grid;
          grid-template-columns: minmax(190px, 1fr) minmax(180px, 260px) minmax(190px, 1fr);
          gap: 18px;
          align-items: center;
          margin-bottom: 26px;
        }

        .node {
          min-height: 154px;
          border: 1px solid rgba(96, 55, 34, 0.18);
          border-radius: 24px;
          padding: 20px;
          background: linear-gradient(145deg, #fff4df, #d7b28d);
          box-shadow: 0 16px 35px rgba(80, 45, 28, 0.18), inset 0 1px rgba(255, 255, 255, 0.72);
          position: relative;
          overflow: hidden;
        }

        .node::after {
          content: "";
          position: absolute;
          right: -20px;
          bottom: -22px;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: rgba(84, 44, 25, 0.1);
        }

        .node strong {
          display: block;
          margin-bottom: 10px;
          font-size: 13px;
          color: #8c4f2f;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .node span {
          display: block;
          font-size: 24px;
          font-weight: 800;
          color: #3c2218;
        }

        .node small {
          display: block;
          margin-top: 12px;
          color: #72523e;
          line-height: 1.45;
        }

        .wire {
          position: relative;
          min-height: 86px;
          display: grid;
          align-items: center;
        }

        .wire-line {
          height: 7px;
          border-radius: 999px;
          background: linear-gradient(90deg, #7c4a2f, #ca8f4f, #386b66, #7c4a2f);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 8px 20px rgba(94, 50, 30, 0.18);
        }

        .packet {
          position: absolute;
          top: 50%;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          opacity: 0;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 0 7px rgba(255, 243, 217, 0.5), 0 6px 16px rgba(68, 36, 22, 0.24);
        }

        .packet.request {
          background: #ffe6a7;
        }

        .packet.response {
          background: #4f8880;
        }

        .wire.sending .packet.request {
          animation: sendPacket 1.1s ease-in-out infinite;
          opacity: 1;
        }

        .wire.received .packet.response,
        .wire.error .packet.response {
          animation: returnPacket 0.95s ease-out both;
          opacity: 1;
        }

        .wire.error .packet.response {
          background: #b4513f;
        }

        @keyframes sendPacket {
          from { left: 3%; }
          to { left: 97%; }
        }

        @keyframes returnPacket {
          from { left: 97%; }
          to { left: 3%; }
        }

        .control-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          align-items: center;
        }

        .message-input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid rgba(93, 52, 32, 0.22);
          border-radius: 18px 28px 18px 28px;
          padding: 15px 17px;
          color: #3a2118;
          background: #fffaf0;
          box-shadow: inset 0 3px 10px rgba(90, 48, 27, 0.08);
          outline: none;
        }

        .message-input:focus {
          border-color: #8a5233;
          box-shadow: 0 0 0 4px rgba(166, 103, 59, 0.18), inset 0 3px 10px rgba(90, 48, 27, 0.08);
        }

        .curl-button {
          border: 0;
          border-radius: 24px 12px 24px 12px;
          padding: 15px 24px;
          color: #fff9ec;
          font-weight: 800;
          white-space: nowrap;
          background: linear-gradient(145deg, #8e5636, #4b281c);
          box-shadow: 0 14px 24px rgba(68, 35, 22, 0.26), inset 0 1px rgba(255, 255, 255, 0.24);
          cursor: pointer;
          transform: translateY(0);
          transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
        }

        .curl-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 18px 30px rgba(68, 35, 22, 0.3), inset 0 1px rgba(255, 255, 255, 0.24);
        }

        .curl-button:disabled {
          cursor: wait;
          opacity: 0.72;
        }

        .reply-card {
          margin-top: 18px;
          min-height: 24px;
          padding: 16px 18px;
          border-radius: 18px;
          color: #3d251a;
          background: #fff5e3;
          border: 1px solid rgba(93, 52, 32, 0.16);
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.8);
        }

        .backend-url {
          margin: 12px 0 0;
          color: #7b5843;
          font-size: 12px;
        }

        @media (max-width: 760px) {
          .demo-header,
          .control-row {
            grid-template-columns: 1fr;
            display: grid;
          }

          .process-map {
            grid-template-columns: 1fr;
          }

          .wire {
            min-height: 72px;
            transform: rotate(90deg);
          }

          .curl-button {
            width: 100%;
          }
        }
      `}</style>
      <section className="demo-panel" aria-label="API call demo">
        <div className="demo-header">
          <div>
            <h1>Coffee API Demo</h1>
          </div>
          <p>Click the curled button to send a message from the UI to the backend and watch the response come home.</p>
        </div>

        <div className="process-map" aria-hidden="true">
          <div className="node">
            <strong>Frontend</strong>
            <span>button-demo-ui</span>
            <small>Packages the message and sends a REST request.</small>
          </div>
          <div className={`wire ${loading ? "sending" : hasError ? "error" : hasResponse ? "received" : ""}`}>
            <div className="wire-line" />
            <div className="packet request" />
            <div className="packet response" />
          </div>
          <div className="node">
            <strong>Backend</strong>
            <span>button-demo-back</span>
            <small>Receives the API call and returns a reply.</small>
          </div>
        </div>

        <div className="control-row">
          <input className="message-input" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button id="click-button" className="curl-button" onClick={handleClick} disabled={loading}>
            {loading ? "Sending..." : "Send API call"}
          </button>
        </div>

        <div id="reply" className="reply-card">
          {reply}
        </div>
        <p className="backend-url">Backend: {BACKEND_URL}</p>
      </section>
    </main>
  );
}
