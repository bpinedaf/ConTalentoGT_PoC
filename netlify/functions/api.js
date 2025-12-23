export default async (req, context) => {
  try {
    const API_URL = process.env.VITE_API_URL;   // OK usarla aquí (o crea API_URL sin VITE si prefieres)
    const API_TOKEN = process.env.API_TOKEN;

    if (!API_URL || !API_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: "Server env vars missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(API_URL);

    // Passthrough de query params del frontend
    const incomingUrl = new URL(req.url);
    incomingUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

    // Inyecta token en server-side
    url.searchParams.set("token", API_TOKEN);

    const method = req.method || "GET";
    let body = undefined;
    let headers = { "Content-Type": "application/json" };

    if (method !== "GET" && method !== "HEAD") {
      const text = await req.text();
      body = text || "{}";
    }

    const upstream = await fetch(url.toString(), {
      method,
      headers,
      body,
    });

    const outText = await upstream.text();
    return new Response(outText, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
