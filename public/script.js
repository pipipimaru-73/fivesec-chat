// ===== WebSocket 接続 =====
const ws = new WebSocket(
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host
);

// テーマごとの絵文字
const themes = {
  normal:   ["🐶","🐱","🐰","🐻","🐼","🐵","🐸","🐧","🐤","🦊"],
  aquarium: ["🐠","🐟","🐡","🦈","🐬","🐳","🐋","🦑","🐙","🦐"],
  jungle:   ["🦁","🐯","🐵","🦜","🐍","🐘","🦧","🦒","🦓","🦩"],
   starry: ["✨","🌙","⭐","🌌","🌠","🌟","💫","🪐","🌃","🌔"]
};
function setTheme(name) {
  currentTheme = name;
  document.body.className = name; // bodyにテーマ名を付ける
}

let currentTheme = "normal"; // デフォルト

// ランダムに絵文字を配置
function scatterEmoji() {
  const list = themes[currentTheme] ?? themes.normal;
  const emoji = list[Math.floor(Math.random() * list.length)];

  const el = document.createElement("div");
  el.className = "msg";
  el.textContent = emoji;

  el.style.left = Math.random() * (window.innerWidth  - 100) + "px";
  el.style.top  = Math.random() * (window.innerHeight - 50)  + "px";

  document.body.appendChild(el);

  setTimeout(() => {
    el.style.transform = "scale(0.2)";
    el.style.color = "#888";
    el.style.opacity = "0";
  }, 100);

  setTimeout(() => el.remove(), 5000);
}

// 常に3秒ごとに1つ散布
setInterval(scatterEmoji, 3000);

// 受信テキストの風船表示
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

// フォーム送信
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

// テーマ変更（HTMLのボタンから呼ぶ）
function setTheme(name) {
  currentTheme = name;
  document.body.className = name; // bodyにテーマ名を付ける
  console.log("テーマ切り替え:", name);
}
// グローバルに公開（インラインonclickで使えるように）
window.setTheme = setTheme;

