import { createServer } from "node:http";
import { processOnboarding } from "./pipeline.js";

const PORT = Number(process.env.PORT || 8787);

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "agency-onboarding-automation" }));
    return;
  }

  if (req.method === "POST" && req.url === "/webhook/onboarding") {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      const result = await processOnboarding(body, {
        clickUp: { apiToken: process.env.CLICKUP_API_TOKEN, dryRun: !process.env.CLICKUP_API_TOKEN },
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, result }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: message }));
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    ok: false,
    hint: "POST /webhook/onboarding with onboarding form JSON. GET /health",
  }));
});

server.listen(PORT, () => {
  console.log(`Onboarding webhook listening on http://localhost:${PORT}`);
  console.log(`POST http://localhost:${PORT}/webhook/onboarding`);
});
