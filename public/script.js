const ws = new WebSocket(
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host
);

const themes = {
  normal: ["🐶","🐱","🐰","🐻","🐼","🐵","🐸","🐧","🐤","🦊"],
  aquarium: ["🐠","🐟","🐡","🦈","🐬","🐳","🐋","🦑","🐙","🦐"],
  jungle: ["🦁","🐯","🐵","🦜","🐍","🐘","🦧","🦒","🦓","🦩"],
  starry: ["✨","🌟","⭐","💫","🌙","🌌"]
};

let currentTheme = "normal";

function scatterEmoji() {
  const list = themes[currentTheme];
  const emoji = list[Math.floor(Math.random() * list.length)];
  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = emoji;
  el.style.left = Math.random() * (window.innerWidth - 50) + "px";
  el.style.top  = Math.random() * (window.innerHeight - 100) + "px";

  document.body.appendChild(el);

  setTimeout(() => {
    el.style.transform = "scale(0.5)";
    el.style.opacity = "0";
  }, 3000);

  setTimeout(() => el.remove(), 6000);
}

// 常に3〜4匹いるように
setInterval(() => {
  const animals = document.querySelectorAll(".msg");
  if (animals.length < 4) scatterEmoji();
}, 2000);

ws.onmessage = (ev) => {
  const { t } = JSON.parse(ev.data);
  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = t;
  el.style.left = Math.random() * (window.innerWidth - 100) + "px";
  el.style.top  = Math.random() * (window.innerHeight - 50) + "px";
  document.body.appendChild(el);

  setTimeout(() => {
    el.style.transform = "scale(0.2)";
    el.style.opacity = "0";
  }, 100);

  setTimeout(() => el.remove(), 5000);
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
  document.body.className = name === "starry" ? "starry" : "";
}
