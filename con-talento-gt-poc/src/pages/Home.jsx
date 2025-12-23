import { useEffect, useState } from "react";
import { ping } from "../api/api";

export default function Home() {
  const [status, setStatus] = useState({ loading: true, ok: false, msg: "" });

  useEffect(() => {
    (async () => {
      try {
        const r = await ping();
        setStatus({ loading: false, ok: !!r.ok, msg: r.message || "ok" });
      } catch (e) {
        setStatus({ loading: false, ok: false, msg: String(e) });
      }
    })();
  }, []);

  return (
    <div className="grid">
      <div className="card">
        <h2>PoC operativa</h2>
        <div className="muted">
          Esta demo demuestra cómo el formato de entrevista puede convertirse en un sistema digital:
          captura, búsqueda, detalle y notas internas.
        </div>

        <div style={{ marginTop: 12 }}>
          <span className="badge">
            Backend {status.loading ? "verificando..." : status.ok ? "OK" : "Error"} — {status.msg}
          </span>
        </div>

        <div className="btns">
          <a href="/registro"><button className="primary">Registrar candidato</button></a>
          <a href="/consulta"><button>Ir a consulta</button></a>
        </div>
      </div>

      <div className="card">
        <h2>Qué incluye</h2>
        <ul className="muted" style={{ marginTop: 8, lineHeight: 1.7 }}>
          <li>Formulario responsive (móvil primero)</li>
          <li>Consulta con filtros y búsqueda</li>
          <li>Vista detalle por candidato</li>
          <li>Notas internas + cambio de status</li>
        </ul>
      </div>
    </div>
  );
}
