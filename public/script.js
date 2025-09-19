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

// DOM
const playground = document.getElementById("playground");
const form       = document.getElementById("f");
const inputEl    = document.getElementById("inp");

// ===== playground 内の安全ランダム座標 =====
function randomPosInPlayground() {
  const margin = 12;                 // 内側マージン
  const w = playground.clientWidth;
  const h = playground.clientHeight;
  const x = Math.random() * Math.max(0, w - 60 - margin * 2) + margin;
  const y = Math.random() * Math.max(0, h - 60 - margin * 2) + margin;
  return { x, y };
}

// ===== 1つだけの spawnMessage（上書きなし） =====
function spawnMessage(text) {
  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = text;

  const { x, y } = randomPosInPlayground();
  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;

  playground.appendChild(el);

  // ふわっと出てから縮小＆フェード
  requestAnimationFrame(() => {
    el.style.transform = "scale(1)";
    setTimeout(() => {
      el.style.transform = "scale(0.2)";
      el.style.opacity = "0";
      el.style.color = "#888";
    }, 120);
  });

  // 5秒後に消滅
  setTimeout(() => el.remove(), 5000);
}

// ===== ランダム絵文字 =====
function spawnEmoji() {
  const pool = themes[currentTheme];
  spawnMessage(pool[Math.floor(Math.random() * pool.length)]);
}

// ===== 常に3〜4匹キープ（不足分のみ補充、じわじわ増える） =====
setInterval(() => {
  const alive = playground.querySelectorAll(".msg").length;
  if (alive < 3) spawnEmoji();            // 最低3
  if (alive >= 3 && alive < 4 && Math.random() < 0.3) spawnEmoji(); // たまに4
}, 900);

// ===== 受信メッセージも playground 内に表示 =====
ws.onmessage = (ev) => {
  const { t } = JSON.parse(ev.data);
  spawnMessage(t);
};

// ===== 送信処理 =====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;

  try {
    ws.send(JSON.stringify({ text }));
  } catch {
    // WSが使えない時の保険
    fetch("/api/post", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text })
    });
  }
  inputEl.value = "";
});

// ===== テーマ切替（HTMLのonclick用に公開） =====
window.setTheme = (name) => {
  currentTheme = name;
};
