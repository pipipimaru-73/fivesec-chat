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

/* 安全域（重ならないように上下マージン） */
function safeBounds() {
  const topSafe = switcher ? (window.innerHeight - switcher.getBoundingClientRect().bottom + 8) : 56;
  const bottomSafe = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--bar-h')) + 8;
  return { topSafe, bottomSafe };
}

function spawnMessage(text){
  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = text;

  const { topSafe, bottomSafe } = safeBounds();
  const maxX = playground.clientWidth  - 60;
  const maxY = playground.clientHeight - (topSafe + bottomSafe) - 60;

  const x = Math.max(10, Math.random() * maxX);
  const y = Math.max(topSafe + 10, Math.random() * maxY + topSafe);

  el.style.left = x + "px";
  el.style.top  = y + "px";

  playground.appendChild(el);

  setTimeout(() => {
    el.style.transform = "scale(0.2)";
    el.style.opacity = "0.0";
  }, 120);

  setTimeout(() => el.remove(), 5000);
}

function spawnEmoji(){
  const pool = themes[currentTheme];
  spawnMessage(pool[Math.floor(Math.random() * pool.length)]);
}

/* 常時3匹キープ（足りなければ1匹だけ補充） */
setInterval(() => {
  const alive = playground.querySelectorAll(".msg").length;
  if (alive < 3) spawnEmoji();
}, 900);

/* 受信テキストも安全域内に表示 */
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

/* テーマ切替 */
window.setTheme = function(name){
  currentTheme = name;
};
