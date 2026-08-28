// Integration test: proves the button's actual click handler (postClick, the
// same function App.tsx calls) gets a real reaction from the backend.
//
// Prefers an already-running backend (e.g. the sandboxed container x4 just
// brought up on SANDBOX_BACKEND_URL) over spawning its own copy. This isn't
// just an optimization: when a sandbox profile mounts this same repo path
// into a Linux container, that container's `npm install` writes Linux-native
// esbuild binaries into the (bind-mounted, shared) node_modules — spawning a
// second, host-native `tsx` process against that same directory crashes on a
// platform mismatch. Testing the container that's already up sidesteps that
// collision entirely, and is a more honest test of what's actually running.
// Falls back to spawning its own instance for plain standalone `npm test`
// outside x4 (no sandbox up, no collision possible).

import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { postClick } from "../src/api.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const TEST_PORT = process.env.BACKEND_TEST_PORT || "4099";
const SANDBOX_BACKEND_URL = process.env.SANDBOX_BACKEND_URL || "http://localhost:4001";

// x4's attached-repo id is whatever the registry (or whoever added the
// project) called it — "backend", "button-demo-back", anything — not a
// fixed name, so this scans .x4/repos/* for whichever one is actually the
// backend, instead of assuming one literal directory name.
function resolveBackendDir(): string {
  if (process.env.BACKEND_DIR) return process.env.BACKEND_DIR;

  const attachedRoot = path.join(repoRoot, ".x4", "repos");
  if (existsSync(attachedRoot)) {
    for (const name of readdirSync(attachedRoot)) {
      const candidate = path.join(attachedRoot, name);
      if (existsSync(path.join(candidate, "src", "server.ts"))) return candidate;
    }
  }

  const sibling = path.join(repoRoot, "..", "button-demo-back");
  if (existsSync(path.join(sibling, "src", "server.ts"))) return sibling;

  throw new Error(
    "Could not find button-demo-back. Run this through `x4 workspace bootstrap` " +
      "(it should then appear under .x4/repos/<id>), or set BACKEND_DIR.",
  );
}

async function isHealthy(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

function waitForHealth(url: string, timeoutMs = 20000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch {
        // not up yet
      }
      if (Date.now() > deadline) return reject(new Error(`backend did not become healthy at ${url}`));
      setTimeout(attempt, 200);
    };
    attempt();
  });
}

let backendUrl: string;
let child: ReturnType<typeof spawn> | undefined;

if (await isHealthy(`${SANDBOX_BACKEND_URL}/api/health`)) {
  console.log(`[integration test] using already-running backend at ${SANDBOX_BACKEND_URL}`);
  backendUrl = SANDBOX_BACKEND_URL;
} else {
  const backendDir = resolveBackendDir();
  console.log(`[integration test] no sandbox backend up; starting one from ${backendDir} on port ${TEST_PORT}`);
  child = spawn("npx", ["tsx", "src/server.ts"], {
    cwd: backendDir,
    env: { ...process.env, PORT: TEST_PORT },
    stdio: ["ignore", "pipe", "pipe"],
  });
  await waitForHealth(`http://localhost:${TEST_PORT}/api/health`);
  backendUrl = `http://localhost:${TEST_PORT}`;
}

let exitCode = 1;
try {
  // Exactly what the button's onClick handler does.
  const data = await postClick(backendUrl, "integration test click");
  console.log("[integration test] backend replied:", data.reply);

  if (!data.reply.includes("integration test click")) {
    throw new Error(`unexpected backend reply: ${JSON.stringify(data)}`);
  }

  console.log("ok click -> reaction integration test passed");
  exitCode = 0;
} catch (err) {
  console.error("FAILED:", (err as Error).message);
} finally {
  child?.kill();
}

process.exit(exitCode);
