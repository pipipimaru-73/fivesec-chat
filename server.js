// server.js
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import rateLimit from "express-rate-limit";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const ipLastPost = new Map();

app.use(express.static("public")); // publicフォルダを配信

app.use("/api/post",
  rateLimit({ windowMs: 10_000, max: 20 }),
  express.json(),
  (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();
    if ((ipLastPost.get(ip) || 0) > now - 2000) return res.status(429).end();
    const text = String(req.body?.text || "").slice(0, 140).trim();
    if (!text) return res.status(400).end();
    ipLastPost.set(ip, now);
    const payload = JSON.stringify({ t: text, ts: now });
    wss.clients.forEach(c => c.readyState === 1 && c.send(payload));
    res.status(204).end();
  }
);

wss.on("connection", (ws) => {
  ws.on("message", (buf) => {
    const now = Date.now();
    try {
      const { text } = JSON.parse(buf.toString());
      const t = String(text || "").slice(0, 140).trim();
      if (!t) return;

      if (ws._last && now - ws._last < 2000) return;
      ws._last = now;

      const payload = JSON.stringify({ t, ts: now });
      wss.clients.forEach(c => c.readyState === 1 && c.send(payload));
    } catch {}
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("listening on " + PORT));
