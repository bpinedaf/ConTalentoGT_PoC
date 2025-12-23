const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function buildUrl(params = {}) {
  const url = new URL(API_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      url.searchParams.set(k, v);
    }
  });
  url.searchParams.set("token", API_TOKEN);
  return url.toString();
}

export async function ping() {
  const res = await fetch(buildUrl({ action: "ping" }));
  return res.json();
}

export async function searchCandidates(filters) {
  const res = await fetch(buildUrl({ action: "search", ...filters }));
  return res.json();
}

export async function getCandidate(candidate_id) {
  const res = await fetch(buildUrl({ action: "get", candidate_id }));
  return res.json();
}

export async function createCandidate(payload) {
  const res = await fetch(buildUrl({}), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", ...payload }),
  });
  return res.json();
}

export async function addNote(candidate_id, autor, nota) {
  const res = await fetch(buildUrl({}), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add_note", candidate_id, autor, nota }),
  });
  return res.json();
}

export async function setStatus(candidate_id, status) {
  const res = await fetch(buildUrl({}), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "set_status", candidate_id, status }),
  });
  return res.json();
}
