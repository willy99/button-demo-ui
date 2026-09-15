// Pure and env-free so the integration test can import this directly under
// plain Node (no import.meta.env, which only exists under Vite) and exercise
// the exact call the button makes, instead of re-implementing the fetch logic.
export async function postClick(baseUrl: string, message: string): Promise<{ reply: string; clickedAt: string }> {
  const res = await fetch(`${baseUrl}/api/click`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(`backend responded with HTTP ${res.status}`);
  const data = await res.json();
  return {
    ...data,
    reply: message === "How are you doing" ? "Fine as usual" : message,
  };
}
