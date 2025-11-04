(function () {
	const STORAGE_KEY = "snake_leaderboard_v1";
	const NAME_KEY = "snake_player_name";
	const MAX_ROWS = 10;
	const API_URL = (typeof window.SCORE_API_URL === "string" && window.SCORE_API_URL) || null;

	const els = {
		nameInput: document.getElementById("playerName"),
		saveNameBtn: document.getElementById("saveNameBtn"),
		list: document.getElementById("scoreList"),
		hint: document.getElementById("highscoreHint")
	};

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
		const map = new Map();
		for (const e of entries) {
			if (!e || typeof e.name !== "string" || typeof e.score !== "number") continue;
			const name = sanitizeName(e.name);
			if (!name) continue;
			const cur = map.get(name);
			if (!cur || e.score > cur.score) map.set(name, { name, score: Math.floor(e.score) });
		}
		return Array.from(map.values()).sort((a, b) => b.score - a.score).slice(0, MAX_ROWS);
	}
	function render(list) {
		if (!els.list) return;
		els.list.innerHTML = "";
		const medals = [{ emoji: "🥇", color: "#d4af37" }, { emoji: "🥈", color: "#c0c0c0" }, { emoji: "🥉", color: "#cd7f32" }];
		list.forEach((row, i) => {
			const li = document.createElement("li");
			const name = document.createElement("div");
			name.className = "name";
			if (i < 3) {
				const emoji = document.createElement("span");
				emoji.textContent = medals[i].emoji;
				emoji.style.marginRight = "6px";
				const glow = document.createElement("span");
				glow.className = "glow";
				glow.textContent = row.name;
				name.appendChild(emoji);
				name.appendChild(glow);
			} else {
				const rank = document.createElement("span");
				rank.className = "rank";
				rank.textContent = `${i + 1}. `;
				name.appendChild(rank);
				const text = document.createTextNode(row.name);
				name.appendChild(text);
				name.style.color = "var(--text)";
			}
			const score = document.createElement("div");
			score.className = "score";
			score.textContent = row.score;
			li.appendChild(name);
			li.appendChild(score);
			els.list.appendChild(li);
		});
	}
	async function fetchServerList() {
		if (!API_URL) return null;
		try {
			const res = await fetch(API_URL, { headers: { Accept: "application/json" }, cache: "no-store" });
			if (!res.ok) throw new Error(String(res.status));
			const json = await res.json();
			if (!Array.isArray(json)) return null;
			return mergeAndSort(json);
		} catch { return null; }
	}
	async function refresh() {
		const local = readLocal();
		const server = await fetchServerList();
		const merged = mergeAndSort([...(server || []), ...local]);
		render(merged);
	}
	async function bindSession(sessionId) {
		if (!API_URL) { window._scoreNonce = null; return; }
		try {
			const r = await fetch(`${API_URL.replace(/\/$/, "")}/nonce`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ sessionId }),
				cache: "no-store"
			});
			if (!r.ok) throw new Error("no-nonce");
			const j = await r.json();
			if (j && typeof j.nonce === "string") {
				window._scoreNonce = j.nonce;
				window._scoreNonceTs = j.ts || Date.now();
			} else {
				window._scoreNonce = null;
			}
		} catch { window._scoreNonce = null; }
	}
	function initName() {
		const n = getName();
		if (n && els.nameInput) els.nameInput.value = n;
		els.saveNameBtn?.addEventListener("click", async () => {
			const v = sanitizeName(els.nameInput.value);
			if (!v) return;
			setName(v);
			if (els.hint) els.hint.textContent = "Lade Highscore…";
			try {
				if (!API_URL) throw new Error("no-api");
				const res = await fetch(API_URL, { headers: { Accept: "application/json" }, cache: "no-store" });
				if (!res.ok) throw new Error(String(res.status));
				const data = await res.json();
				if (!Array.isArray(data)) throw new Error("invalid");
				const existing = data.find(e => sanitizeName(e.name).toLowerCase() === v.toLowerCase());
				if (existing) {
					if (els.hint) els.hint.textContent = `Highscore für ${v}: ${existing.score}`;
				} else {
					if (els.hint) els.hint.textContent = `Noch kein Score für ${v}`;
				}
			} catch {
				if (els.hint) els.hint.textContent = "Fehler beim Laden des Highscores.";
			}
			refresh();
		});
		els.nameInput?.addEventListener("keydown", (e) => {
			if (e.key === "Enter") els.saveNameBtn.click();
		});
	}
	async function report(scoreIgnored) {
		const name = (getName() || els.nameInput?.value || "").toString().trim();
		if (!name) return;
		const sessionId = window._sessionId || "";
		const nonce = typeof window._scoreNonce === "string" ? window._scoreNonce : null;
		const turns = Array.isArray(window._turns) ? window._turns : [];
		const finalTick = Number(window._lastTick || 0);
		const cur = readLocal();
		writeLocal(cur);
		if (API_URL && sessionId && nonce) {
			const payload = { sessionId, name, nonce, turns, finalTick };
			try {
				const res = await fetch(API_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
					cache: "no-store"
				});
				if (res && res.headers.get("content-type")?.includes("application/json")) {
					const j = await res.json();
					if (!res.ok) {
						if (els.hint) els.hint.textContent = j && j.error ? `Score nicht akzeptiert: ${j.error}` : "Score nicht akzeptiert.";
					} else {
						if (els.hint) els.hint.textContent = `Score akzeptiert: ${j.score}`;
					}
				}
			} catch {}
		}
		refresh();
		try { window._turns = []; window._scoreNonce = null; } catch {}
	}
	initName();
	refresh();
	if (!window.leaderboard) {
		Object.defineProperty(window, "leaderboard", {
			value: { report, bindSession },
			writable: false,
			configurable: false,
			enumerable: true
		});
	}
})();
