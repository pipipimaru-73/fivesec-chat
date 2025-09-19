// ===== WebSocket 接続 =====
const ws = new WebSocket(
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host
);

const themes = {
  normal:   ["🐶","🐱","🐰","🐻","🐼","🐵","🐸","🐧","🐤","🦊"],
  aquarium: ["🐠","🐟","🐡","🦈","🐬","🐳","🐋","🦑","🐙","🦐"],
  jungle:   ["🦁","🐯","🐵","🦜","🐍","🐘","🦧","🦒","🦓","🦩"],
  star:     ["🌟","✨","🌙","🌌","⭐","💫","🌠","🪐"]
};

let currentTheme = "normal"; 

// メッセージのエフェクト
function spawnMessage(text) {
  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = text;

  el.style.left = Math.random() * (window.innerWidth - 100) + "px";
  el.style.top  = Math.random() * (window.innerHeight - 50) + "px";

  document.body.appendChild(el);

  setTimeout(() => {
    el.style.transform = "scale(0.2)";
    el.style.color = "#888";
    el.style.opacity = "0";
  }, 100);

  setTimeout(() => el.remove(), 5000);
}

// ===== 動物エモジ生成 =====
function spawnEmoji() {
  const list = themes[currentTheme];
  const emoji = list[Math.floor(Math.random() * list.length)];
  spawnMessage(emoji);
}

// ===== 常時3匹キープ =====
function maintainEmojis() {
  const current = document.querySelectorAll(".msg").length;
  if (current < 3) {
    spawnEmoji();
  }
}

// 2秒ごとにチェックして不足してたら補充
setInterval(maintainEmojis, 2000);

// ===== WebSocket受信 =====
ws.onmessage = (ev) => {
  const { t } = JSON.parse(ev.data);
  spawnMessage(t);
};

// ===== フォーム送信 =====
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

// ===== テーマ切り替え =====
function setTheme(name) {
  currentTheme = name;
  console.log("テーマ切り替え:", name);
}
const playground = document.getElementById("playground");

function scatterEmoji() {
  const list = themes[currentTheme];
  const emoji = list[Math.floor(Math.random() * list.length)];

  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = emoji;

  // playground のサイズを基準に配置
  const maxX = playground.offsetWidth  - 50;
  const maxY = playground.offsetHeight - 50;
  el.style.left = Math.random() * maxX + "px";
  el.style.top  = Math.random() * maxY + "px";

  playground.appendChild(el);

  setTimeout(() => {
    el.style.transform = "scale(0.2)";
    el.style.color = "#888";
    el.style.opacity = "0";
  }, 100);

  setTimeout(() => el.remove(), 5000);
}
