// ===== WebSocket 接続 =====
const ws = new WebSocket(
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host
);

// テーマごとの絵文字セット
const themes = {
  normal: ["🐶","🐱","🐰","🐻","🐼","🐵","🐸","🐧","🐤","🦊"],
  aquarium: ["🐠","🐟","🐡","🦈","🐬","🐳","🐋","🦑","🐙","🦐"],
  jungle: ["🦁","🐯","🐵","🦜","🐍","🐘","🦧","🦒","🦓","🦩"],
  starry: ["⭐","🌟","✨","🌌","🌠","🌙","🪐","☄️"]
};

let currentTheme = "normal"; // デフォルト

// ランダムに絵文字を配置
function scatterEmoji() {
  const list = themes[currentTheme];
  const emoji = list[Math.floor(Math.random() * list.length)];

  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = emoji;

  el.style.left = Math.random() * (window.innerWidth - 100) + "px";
  el.style.top  = Math.random() * (window.innerHeight - 100) + "px";

  document.body.appendChild(el);

  setTimeout(() => {
    el.style.transform = "scale(0.2)";
    el.style.color = "#888";
    el.style.opacity = "0";
  }, 100);

  setTimeout(() => el.remove(), 5000);
}

// 常に3〜4個は画面に散らばるようにする
setInterval(() => {
  for (let i = 0; i < 3; i++) scatterEmoji();
}, 4000);

// WebSocket受信
ws.onmessage = (ev) => {
  const { t } = JSON.parse(ev.data);
  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = t;

  el.style.left = Math.random() * (window.innerWidth - 100) + "px";
  el.style.top  = Math.random() * (window.innerHeight - 100) + "px";

  document.body.appendChild(el);

  setTimeout(() => {
    el.style.transform = "scale(0.2)";
    el.style.color = "#888";
    el.style.opacity = "0";
  }, 100);

  setTimeout(() => el.remove(), 5000);
};

// 送信処理
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

// テーマ切り替え
function setTheme(name) {
  currentTheme = name;
  console.log("テーマ切り替え:", name);
}
