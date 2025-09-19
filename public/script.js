// ===== WebSocket =====
const ws = new WebSocket(
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host
);

// ===== テーマ =====
const themes = {
  normal:   ["🐶","🐱","🐰","🐻","🐼","🐵","🐸","🐧","🐤","🦊"],
  aquarium: ["🐠","🐟","🐡","🦈","🐬","🐳","🐋","🦑","🐙","🦐"],
  jungle:   ["🦁","🐯","🐵","🦜","🐍","🐘","🦧","🦒","🦓","🦩"],
  star:     ["🌟","✨","🌙","🌌","⭐","💫","🌠","🪐"]
};
let currentTheme = "normal";

// DOM 参照
const playground = document.getElementById("playground");
const f          = document.getElementById("f");
const inp        = document.getElementById("inp");

// ===== playground 内の安全なランダム位置 =====
function randomPosInPlayground() {
  // 内側マージン（枠にかぶらないように）
  const m = 12;
  const w = playground.clientWidth;
  const h = playground.clientHeight;
  const x = Math.random() * Math.max(0, w - 60 - m * 2) + m;
  const y = Math.random() * Math.max(0, h - 60 - m * 2) + m;
  return { x, y };
}

// ===== メッセージ/絵文字 生成（playgroundの中だけ） =====
function spawnMessage(text) {
  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = text;

  const { x, y } = randomPosInPlayground();
  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;

  playground.appendChild(el);

  // ふわっと→縮小フェード
  requestAnimationFrame(() => {
    el.style.transform = "scale(1)";
    setTimeout(() => {
      el.style.transform = "scale(0.2)";
      el.style.opacity = "0";
    }, 120);
  });

  // 5秒で消える
  setTimeout(() => el.remove(), 5000);
}

function spawnEmoji() {
  const pool  = themes[currentTheme];
  const emoji = pool[Math.floor(Math.random() * pool.length)];
  spawnMessage(emoji);
}

// ===== 常時3匹キープ（不足分のみ補充） =====
setInterval(() => {
  const alive = playground.querySelectorAll(".msg").length;
  if (alive < 3) spawnEmoji();
}, 900);

// ===== WebSocket 受信 =====
ws.onmessage = (ev) => {
  const { t } = JSON.parse(ev.data);
  spawnMessage(t);
};

// ===== 送信 =====
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

// ===== テーマ切替（グローバル公開；HTMLの onclick 用） =====
window.setTheme = (name) => {
  currentTheme = name;
};
