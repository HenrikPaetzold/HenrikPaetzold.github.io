// Lightweight leaderboard with localStorage fallback and optional REST backend.
// Exposes window.leaderboard.report(score) to be called on game over.

(function () {
  const STORAGE_KEY = "snake_leaderboard_v1";
  const NAME_KEY = "snake_player_name";
  const MAX_ROWS = 10;

  // If you deploy a backend, set: window.SCORE_API_URL = "https://your-endpoint.example/scores";
  const API_URL = (typeof window.SCORE_API_URL === "string" && window.SCORE_API_URL) || null;

  const els = {
    nameInput: document.getElementById("playerName"),
    saveNameBtn: document.getElementById("saveNameBtn"),
    list: document.getElementById("scoreList"),
  };

  // --- Utilities ---
  function readLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
    } catch { return []; }
  }
  function writeLocal(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch {}
  }
  function getName() {
    return (localStorage.getItem(NAME_KEY) || "").trim();
  }
  function setName(n) {
    localStorage.setItem(NAME_KEY, n.trim());
  }
  function sanitizeName(n) {
    return (n || "").toString().replace(/[\n\r\t]/g, " ").trim().slice(0, 24);
  }

  function mergeAndSort(entries) {
    // Keep highest score per name
    const map = new Map();
    for (const e of entries) {
      if (!e || typeof e.name !== "string" || typeof e.score !== "number") continue;
      const name = sanitizeName(e.name);
      if (!name) continue;
      const cur = map.get(name);
      if (!cur || e.score > cur.score) map.set(name, { name, score: Math.floor(e.score) });
    }
    return Array.from(map.values()).sort((a,b) => b.score - a.score).slice(0, MAX_ROWS);
  }

  function render(list) {
    els.list.innerHTML = "";
    for (const row of list) {
      const li = document.createElement("li");
      const name = document.createElement("div");
      name.className = "name";
      name.textContent = row.name;
      const score = document.createElement("div");
      score.className = "score";
      score.textContent = row.score;
      li.appendChild(name);
      li.appendChild(score);
      els.list.appendChild(li);
    }
  }

  async function fetchServerList() {
    if (!API_URL) return null;
    try {
      const res = await fetch(API_URL, { headers: { "Accept": "application/json" }, cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      if (!Array.isArray(json)) return null;
      return mergeAndSort(json);
    } catch { return null; }
  }

  async function pushServerScore(entry) {
    if (!API_URL) return;
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    } catch {}
  }

  async function refresh() {
    const local = readLocal();
    const server = await fetchServerList();
    const merged = mergeAndSort([...(server || []), ...local]);
    render(merged);
  }

  // --- Name handling UI ---
  function initName() {
    const n = getName();
    if (n && els.nameInput) els.nameInput.value = n;
    els.saveNameBtn?.addEventListener("click", () => {
      const v = sanitizeName(els.nameInput.value);
      if (!v) return;
      setName(v);
      refresh();
    });
    els.nameInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") els.saveNameBtn.click();
    });
  }

  // --- Public API to report a score ---
  async function report(score) {
    const name = sanitizeName(getName() || els.nameInput?.value || "");
    if (!name) return; // No name set -> do nothing

    const entry = { name, score: Math.floor(score), ts: Date.now() };

    // local write (merge max-by-name)
    const cur = readLocal();
    const merged = mergeAndSort([...cur, entry]);
    writeLocal(merged);

    // optional server push
    pushServerScore(entry);

    // update UI
    refresh();
  }

  // Boot
  initName();
  refresh();

  window.leaderboard = { report };
})();
