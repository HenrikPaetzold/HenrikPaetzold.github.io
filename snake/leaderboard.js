// leaderboard.js - gepatcht für nonce + events proof
// Lightweight leaderboard with localStorage fallback and optional REST backend.
// Exposes window.leaderboard.report(score) to be called on game over.

(function () {
	const STORAGE_KEY = "snake_leaderboard_v1";
	const NAME_KEY = "snake_player_name";
	const MAX_ROWS = 10;

	const API_URL =
		(typeof window.SCORE_API_URL === "string" && window.SCORE_API_URL) || null;

	const els = {
		nameInput: document.getElementById("playerName"),
		saveNameBtn: document.getElementById("saveNameBtn"),
		list: document.getElementById("scoreList"),
		hint: document.getElementById("highscoreHint"),
	};

	// --- Utilities ---
	function readLocal() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	}
	function writeLocal(arr) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
		} catch {}
	}
	function getName() {
		return (localStorage.getItem(NAME_KEY) || "").trim();
	}
	function setName(n) {
		localStorage.setItem(NAME_KEY, n.trim());
	}
	function sanitizeName(n) {
		return (n || "")
			.toString()
			.replace(/[\n\r\t]/g, " ")
			.trim()
			.slice(0, 24);
	}

	function mergeAndSort(entries) {
		// Keep highest score per name
		const map = new Map();
		for (const e of entries) {
			if (!e || typeof e.name !== "string" || typeof e.score !== "number")
				continue;
			const name = sanitizeName(e.name);
			if (!name) continue;
			const cur = map.get(name);
			if (!cur || e.score > cur.score)
				map.set(name, { name, score: Math.floor(e.score) });
		}
		return Array.from(map.values())
			.sort((a, b) => b.score - a.score)
			.slice(0, MAX_ROWS);
	}

	function render(list) {
		if (!els.list) return;
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
			const res = await fetch(API_URL, {
				headers: { Accept: "application/json" },
				cache: "no-store",
			});
			if (!res.ok) throw new Error(String(res.status));
			const json = await res.json();
			if (!Array.isArray(json)) return null;
			return mergeAndSort(json);
		} catch {
			return null;
		}
	}

	// --- NONCE / server push helpers ---
	async function fetchNonce() {
		// Fetch a fresh nonce from worker; store on window for the game to use.
		if (!API_URL) {
			window._scoreNonce = null;
			return null;
		}
		try {
			const res = await fetch(`${API_URL.replace(/\/$/, "")}/nonce`, { cache: "no-store" });
			if (!res.ok) throw new Error("no-nonce");
			const j = await res.json();
			// worker returns { nonce, ts }
			if (j && typeof j.nonce === "string") {
				window._scoreNonce = j.nonce;
				window._scoreNonceTs = j.ts || Date.now();
				return j.nonce;
			}
		} catch (e) {
			// ignore, keep nonce null
		}
		window._scoreNonce = null;
		return null;
	}

	async function pushServerScore(entry) {
		if (!API_URL) return;
		try {
			await fetch(API_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(entry),
				cache: "no-store",
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
		els.saveNameBtn?.addEventListener("click", async () => {
			const v = sanitizeName(els.nameInput.value);
			if (!v) return;
			setName(v);

			if (els.hint) els.hint.textContent = "Lade Highscore…";

			try {
				if (!API_URL) throw new Error("no-api");
				const res = await fetch(API_URL, {
					headers: { Accept: "application/json" },
					cache: "no-store",
				});
				if (!res.ok) throw new Error(String(res.status));
				const data = await res.json();
				if (!Array.isArray(data)) throw new Error("invalid");

				const existing = data.find(
					(e) => sanitizeName(e.name).toLowerCase() === v.toLowerCase()
				);
				if (existing) {
					if (els.hint) els.hint.textContent = `Highscore für ${v}: ${existing.score}`;
				} else {
					if (els.hint) els.hint.textContent = `Noch kein Score für ${v}`;
				}
			} catch (err) {
				if (els.hint) els.hint.textContent = "Fehler beim Laden des Highscores.";
			}

			// refresh list (local+server)
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

		score = Math.floor(score);

		// local write (merge max-by-name)
		const cur = readLocal();
		const merged = mergeAndSort([...cur, { name, score }]);
		writeLocal(merged);

		// --- NEW: attach proof (nonce + events) if available ---
		const events = Array.isArray(window._ateEvents) ? window._ateEvents : null;
		const nonce = typeof window._scoreNonce === "string" ? window._scoreNonce : null;

		// Prefer to send proof if we have a server
		if (API_URL && nonce && events) {
			const payload = { name, score: Math.floor(score), nonce, events };
			try {
				const res = await fetch(API_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
					cache: "no-store",
				});
				// if server returns JSON with an error, act on it
				if (res && res.headers.get("content-type")?.includes("application/json")) {
					const j = await res.json();
					if (!res.ok) {
						console.warn("score rejected by server:", j);
						// optional: surface to user
						if (els.hint) els.hint.textContent = (j && j.error) ? `Score nicht akzeptiert: ${j.error}` : "Score nicht akzeptiert.";
						// refresh UI from local (server not updated)
						refresh();
						// try to fetch a fresh nonce for next game
						fetchNonce();
						return;
					} else {
						// accepted — store server result if wanted
						// optionally update local cache with accepted best score from server
					}
				}
			} catch (e) {
				// fallback: server unreachable -> keep local
				console.warn("failed to push score to server", e);
			}
		} else {
			// If we have an API but no nonce/events, attempt to refresh nonce for next round
			if (API_URL && !nonce) fetchNonce();
		}

		// update UI
		refresh();

		// After reporting, optionally wipe the events so they can't be reused
		try { window._ateEvents = []; window._scoreNonce = null; } catch (e) {}
	}

	// Boot
	initName();
	// fetch nonce proactively if we have API_URL
	if (API_URL) fetchNonce().catch(()=>{});
	refresh();

	// Expose API
	if (!window.leaderboard) {
		Object.defineProperty(window, 'leaderboard', {
			value: { report },
			writable: false,
			configurable: false,
			enumerable: true
		});
	}
})();
