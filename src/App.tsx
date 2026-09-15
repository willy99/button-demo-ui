import { useState } from "react";
import { postClick } from "./api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";
const INITIAL_REPLY = "Reply will appear here.";
const REQUEST_ANIMATION_MS = 1100;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function App() {
  const [message, setMessage] = useState("Hello from the button!");
  const [reply, setReply] = useState(INITIAL_REPLY);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const hasResponse = reply !== INITIAL_REPLY && !loading;
  const hasError = hasResponse && reply.startsWith("Error:");
  const processStatus = loading
    ? "Sending request to backend..."
    : hasError
      ? "Backend returned an error."
      : hasResponse
        ? "Response received from backend."
        : "Ready to send an API call.";

  async function handleClick() {
    setLoading(true);
    setReply("Waiting for backend...");
    const startedAt = Date.now();
    try {
      const data = await postClick(BACKEND_URL, message);
      await wait(Math.max(0, REQUEST_ANIMATION_MS - (Date.now() - startedAt)));
      setReply(data.reply);
    } catch (err) {
      await wait(Math.max(0, REQUEST_ANIMATION_MS - (Date.now() - startedAt)));
      setReply(`Error: ${(err as Error).message}. Is the backend running?`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={`demo-shell ${isDarkMode ? "dark" : ""}`}>
      <style>{`
        :root {
          color: #321f17;
          background: #f3e4d0;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        body {
          margin: 0;
          min-width: 320px;
          background: #f3e4d0;
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
          background:
            radial-gradient(circle at 18% 18%, rgba(255, 248, 232, 0.9), transparent 28rem),
            radial-gradient(circle at 82% 12%, rgba(188, 124, 72, 0.28), transparent 22rem),
            linear-gradient(135deg, #f5e4cc 0%, #b98258 46%, #553020 100%);
          transition: background 180ms ease, color 180ms ease;
        }

        .demo-shell.dark {
          color: #f6ead8;
          background:
            radial-gradient(circle at 18% 18%, rgba(85, 115, 112, 0.34), transparent 28rem),
            radial-gradient(circle at 82% 12%, rgba(189, 130, 82, 0.16), transparent 22rem),
            linear-gradient(135deg, #111615 0%, #263331 48%, #100c0a 100%);
        }

        .demo-panel {
          width: min(940px, 100%);
          border: 1px solid rgba(87, 50, 32, 0.26);
          border-radius: 28px;
          padding: clamp(22px, 4vw, 40px);
          background:
            linear-gradient(160deg, rgba(255, 248, 235, 0.92), rgba(229, 195, 154, 0.86)),
            #f5dec0;
          box-shadow: 0 28px 80px rgba(58, 31, 19, 0.3), inset 0 1px rgba(255, 255, 255, 0.78);
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
          color: #351d14;
          text-shadow: 0 1px rgba(255, 249, 235, 0.8);
        }

        .demo-header p {
          max-width: 310px;
          margin: 6px 0 0;
          color: #71513f;
          line-height: 1.55;
        }

        .header-tools {
          display: grid;
          justify-items: end;
          gap: 12px;
        }

        .theme-toggle {
          display: inline-grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(87, 50, 32, 0.22);
          border-radius: 50%;
          color: #43261a;
          background: rgba(255, 248, 235, 0.82);
          box-shadow: 0 10px 20px rgba(58, 31, 19, 0.14), inset 0 1px rgba(255, 255, 255, 0.78);
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, color 160ms ease;
        }

        .theme-toggle:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 24px rgba(58, 31, 19, 0.2), inset 0 1px rgba(255, 255, 255, 0.78);
        }

        .theme-toggle svg {
          width: 19px;
          height: 19px;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
        }

        .process-map {
          display: grid;
          grid-template-columns: minmax(190px, 1fr) minmax(180px, 260px) minmax(190px, 1fr);
          gap: 20px;
          align-items: center;
          margin-bottom: 26px;
        }

        .node {
          min-height: 154px;
          border: 1px solid rgba(96, 55, 34, 0.2);
          border-radius: 24px;
          padding: 20px;
          background:
            linear-gradient(145deg, rgba(255, 248, 232, 0.96), rgba(202, 151, 102, 0.76)),
            #e3be92;
          box-shadow: 0 16px 35px rgba(80, 45, 28, 0.18), inset 0 1px rgba(255, 255, 255, 0.72);
          position: relative;
          overflow: hidden;
        }

        .node::after {
          content: "";
          position: absolute;
          right: -34px;
          bottom: -34px;
          width: 108px;
          height: 108px;
          border-radius: 32px;
          background: rgba(84, 44, 25, 0.1);
          transform: rotate(18deg);
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
          min-height: 118px;
          display: grid;
          align-items: center;
        }

        .wire-line {
          position: relative;
          height: 7px;
          border-radius: 999px;
          background: linear-gradient(90deg, #7c4a2f, #ca8f4f, #386b66, #7c4a2f);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 8px 20px rgba(94, 50, 30, 0.18);
        }

        .wire-line::before,
        .wire-line::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 12px;
          height: 12px;
          border-top: 3px solid currentColor;
          border-right: 3px solid currentColor;
          color: #74452d;
        }

        .wire-line::before {
          right: 2px;
          transform: translateY(-50%) rotate(45deg);
        }

        .wire-line::after {
          left: 2px;
          color: #386b66;
          transform: translateY(-50%) rotate(225deg);
        }

        .wire-label {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: max-content;
          max-width: 100%;
          padding: 6px 10px;
          border-radius: 14px 7px 14px 7px;
          border: 1px solid rgba(88, 50, 31, 0.16);
          color: #4b2a1e;
          background: rgba(255, 247, 231, 0.86);
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(75, 42, 29, 0.12);
        }

        .wire-label.request-label {
          top: 18px;
        }

        .wire-label.response-label {
          bottom: 18px;
          color: #315f5a;
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
          border-radius: 26px 10px 26px 10px;
          padding: 15px 24px;
          color: #fff9ec;
          font-weight: 800;
          white-space: nowrap;
          background: linear-gradient(145deg, #8e5636, #4b281c);
          box-shadow: 0 14px 24px rgba(68, 35, 22, 0.26), inset 0 1px rgba(255, 255, 255, 0.24);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transform: translateY(0);
          transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
        }

        .curl-button::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(120deg, rgba(255, 244, 215, 0.22), transparent 46%);
          pointer-events: none;
        }

        .curl-button::after {
          content: "";
          position: absolute;
          right: -14px;
          top: -14px;
          width: 42px;
          height: 42px;
          border-radius: 0 0 0 28px;
          background: linear-gradient(135deg, rgba(255, 235, 191, 0.46), rgba(110, 61, 38, 0.18));
          box-shadow: -4px 4px 12px rgba(50, 25, 15, 0.22);
          pointer-events: none;
        }

        .curl-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 18px 30px rgba(68, 35, 22, 0.3), inset 0 1px rgba(255, 255, 255, 0.24);
        }

        .curl-button:disabled {
          cursor: wait;
          opacity: 0.72;
        }

        .process-status {
          margin: -6px 0 18px;
          color: #5c3a2a;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0;
        }

        .reply-card {
          margin-top: 18px;
          min-height: 24px;
          padding: 16px 18px;
          border-radius: 20px 12px 20px 12px;
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

        .demo-shell.dark .demo-panel {
          border-color: rgba(239, 216, 184, 0.16);
          background:
            linear-gradient(160deg, rgba(46, 58, 55, 0.94), rgba(29, 32, 29, 0.9)),
            #242c29;
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42), inset 0 1px rgba(255, 255, 255, 0.1);
        }

        .demo-shell.dark h1 {
          color: #fff4df;
          text-shadow: 0 1px rgba(0, 0, 0, 0.32);
        }

        .demo-shell.dark .demo-header p,
        .demo-shell.dark .node small,
        .demo-shell.dark .backend-url {
          color: #cbb9a2;
        }

        .demo-shell.dark .theme-toggle {
          border-color: rgba(239, 216, 184, 0.2);
          color: #fce8b6;
          background: rgba(23, 26, 24, 0.84);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.28), inset 0 1px rgba(255, 255, 255, 0.1);
        }

        .demo-shell.dark .node {
          border-color: rgba(239, 216, 184, 0.14);
          background:
            linear-gradient(145deg, rgba(55, 68, 64, 0.94), rgba(35, 41, 38, 0.92)),
            #2f3936;
          box-shadow: 0 16px 35px rgba(0, 0, 0, 0.28), inset 0 1px rgba(255, 255, 255, 0.1);
        }

        .demo-shell.dark .node::after {
          background: rgba(255, 234, 198, 0.08);
        }

        .demo-shell.dark .node strong {
          color: #e2a66f;
        }

        .demo-shell.dark .node span,
        .demo-shell.dark .reply-card {
          color: #fff4df;
        }

        .demo-shell.dark .wire-label {
          border-color: rgba(239, 216, 184, 0.16);
          color: #f1d8af;
          background: rgba(25, 31, 29, 0.88);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.24);
        }

        .demo-shell.dark .wire-label.response-label {
          color: #a7d0c7;
        }

        .demo-shell.dark .message-input,
        .demo-shell.dark .reply-card {
          border-color: rgba(239, 216, 184, 0.16);
          background: #151a18;
          box-shadow: inset 0 3px 10px rgba(0, 0, 0, 0.22);
        }

        .demo-shell.dark .message-input {
          color: #fff4df;
        }

        .demo-shell.dark .message-input:focus {
          border-color: #d09563;
          box-shadow: 0 0 0 4px rgba(208, 149, 99, 0.2), inset 0 3px 10px rgba(0, 0, 0, 0.22);
        }

        .demo-shell.dark .process-status {
          color: #e8cfaa;
        }

        @media (max-width: 760px) {
          .demo-header,
          .control-row {
            grid-template-columns: 1fr;
            display: grid;
          }

          .header-tools {
            justify-items: start;
          }

          .process-map {
            grid-template-columns: 1fr;
          }

          .wire {
            min-height: 72px;
          }

          .wire-line {
            width: 7px;
            height: 72px;
            justify-self: center;
            background: linear-gradient(180deg, #7c4a2f, #ca8f4f, #386b66, #7c4a2f);
          }

          .wire-line::before {
            top: auto;
            right: 50%;
            bottom: 1px;
            transform: translateX(50%) rotate(135deg);
          }

          .wire-line::after {
            top: 1px;
            left: 50%;
            transform: translateX(-50%) rotate(315deg);
          }

          .wire-label {
            left: calc(50% + 18px);
            transform: none;
          }

          .wire-label.request-label {
            top: 4px;
          }

          .wire-label.response-label {
            bottom: 4px;
          }

          @keyframes sendPacket {
            from { top: 8%; }
            to { top: 92%; }
          }

          @keyframes returnPacket {
            from { top: 92%; }
            to { top: 8%; }
          }

          .curl-button {
            width: 100%;
          }
        }
      `}</style>
      <section className="demo-panel" aria-label="API call demo">
        <div className="demo-header">
          <div>
            <h1>API Demo</h1>
          </div>
          <div className="header-tools">
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Switch to ${isDarkMode ? "bright" : "dark"} mode`}
              onClick={() => setIsDarkMode((current) => !current)}
            >
              {isDarkMode ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3a6 6 0 0 0 9 7.2A9 9 0 1 1 12 3Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="process-map" aria-hidden="true">
          <div className="node">
            <strong>Frontend</strong>
            <span>button-demo-ui</span>
            <small>Packages the message and sends a REST request.</small>
          </div>
          <div className={`wire ${loading ? "sending" : hasError ? "error" : hasResponse ? "received" : ""}`}>
            <div className="wire-label request-label">API request</div>
            <div className="wire-line" />
            <div className="packet request" />
            <div className="packet response" />
            <div className="wire-label response-label">Backend response</div>
          </div>
          <div className="node">
            <strong>Backend</strong>
            <span>button-demo-back</span>
            <small>Receives the API call and returns a reply.</small>
          </div>
        </div>

        <div className="process-status" aria-live="polite">
          {processStatus}
        </div>

        <div className="control-row">
          <input
            className="message-input"
            aria-label="Message to send to backend"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button id="click-button" className="curl-button" onClick={handleClick} disabled={loading}>
            {loading ? "Sending..." : "Send API call"}
          </button>
        </div>

        <div id="reply" className="reply-card">
          {reply}
        </div>
        <p className="backend-url">Backend: /back</p>
      </section>
    </main>
  );
}
