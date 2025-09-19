// ===== WebSocket 接続 =====
const ws = new WebSocket(
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host
);

// 受信したテキストを画面にポップ表示
ws.onmessage = (ev) => {
  const { t } = JSON.parse(ev.data);
  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = t;

  el.style.left = Math.random() * (window.innerWidth  - 100) + "px";
  el.style.top  = Math.random() * (window.innerHeight - 50)  + "px";

  document.body.appendChild(el);

  setTimeout(() => {
    el.style.transform = "scale(0.2)";
    el.style.color = "#888";
    el.style.opacity = "0";
  }, 100);

  setTimeout(() => el.remove(), 5000);
};

// ===== 送信処理 =====
const f   = document.getElementById("f");
const inp = document.getElementById("inp");

f.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = inp.value.trim();
  if (!text) return;

  try {
    ws.send(JSON.stringify({ text }));
  } catch {
    fetch("/api/post", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text })
    });
  }
  inp.value = "";
});
