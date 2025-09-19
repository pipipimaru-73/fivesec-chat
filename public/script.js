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
const playground = document.getElementById("playground");

// メッセージ表示
function spawnMessage(text) {
  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = text;

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

// ランダム絵文字
function spawnEmoji() {
  const list = themes[currentTheme];
  const emoji = list[Math.floor(Math.random() * list.length)];
  spawnMessage(emoji);
}

// 常に3匹を維持（1匹ずつ補充）
function maintainEmojis() {
  const current = playground.querySelectorAll(".msg").length;
  if (current < 3) {
    spawnEmoji();
  }
}
setInterval(maintainEmojis, 1500);

ws.onmessage = (ev) => {
  const { t } = JSON.parse(ev.data);
  spawnMessage(t);
};

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

function setTheme(name) {
  currentTheme = name;
}
