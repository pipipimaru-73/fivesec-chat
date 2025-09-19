const ws = new WebSocket((location.protocol === "https:" ? "wss://" : "ws://") + location.host);

const themes = {
  normal:   ["🐶","🐱","🐰","🐻","🐼","🐵","🐸","🐧","🐤","🦊"],
  aquarium: ["🐠","🐟","🐡","🦈","🐬","🐳","🐋","🦑","🐙","🦐"],
  jungle:   ["🦁","🐯","🐵","🦜","🐍","🐘","🦧","🦒","🦓","🦩"],
  star:     ["🌟","✨","🌙","🌌","⭐","💫","🌠","🪐"]
};
let currentTheme = "normal";

const playground = document.getElementById("playground");
const switcher   = document.getElementById("theme-switcher");

/* playground の内側に安全マージンを設けて乱数配置 */
function randomPosInPlayground(){
  const m = 12; // 内側マージン
  const w = playground.clientWidth;
  const h = playground.clientHeight;
  const x = Math.random() * Math.max(0, w - 60 - m*2) + m;
  const y = Math.random() * Math.max(0, h - 60 - m*2) + m;
  return { x, y };
}

function spawnMessage(text){
  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = text;

  const { x, y } = randomPosInPlayground();
  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;

  playground.appendChild(el);

  // ふわっと縮小フェード
  requestAnimationFrame(() => {
    el.style.transform = "scale(1)";
    setTimeout(() => {
      el.style.transform = "scale(0.2)";
      el.style.opacity = "0.0";
    }, 120);
  });

  setTimeout(() => el.remove(), 5000);
}

function spawnEmoji(){
  const pool = themes[currentTheme];
  spawnMessage(pool[Math.floor(Math.random() * pool.length)]);
}

/* 常時3匹を維持（不足分のみ補充） */
setInterval(() => {
  const alive = playground.querySelectorAll(".msg").length;
  if (alive < 3) spawnEmoji();
}, 900);

/* 受信メッセージも playground 内に */
ws.onmessage = (ev) => {
  const { t } = JSON.parse(ev.data);
  spawnMessage(t);
};

/* 送信 */
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

/* テーマ切替（グローバルに公開） */
window.setTheme = (name) => { currentTheme = name; };
