import { useEffect, useState } from "react";
import { searchCandidates } from "../api/api";
import { Link } from "react-router-dom";

export default function Search({ setToast }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const [filters, setFilters] = useState({
    q: "",
    puesto: "",
    modalidad: "",
    status: "",
    minPret: "",
    maxPret: "",
  });

  function onChange(field, value) {
    setFilters((p) => ({ ...p, [field]: value }));
  }

  async function runSearch() {
    setLoading(true);
    try {
      const r = await searchCandidates({
        q: filters.q,
        puesto: filters.puesto,
        modalidad: filters.modalidad,
        status: filters.status,
        minPret: filters.minPret,
        maxPret: filters.maxPret,
      });
      if (!r.ok) throw new Error(r.error || "Error consultando");
      setRows(r.data || []);
    } catch (e) {
      setToast({ type: "err", message: String(e) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid">
      <div className="card">
        <h2>Consulta</h2>
        <div className="muted">Búsqueda por nombre/correo/teléfono + filtros.</div>

        <div className="row three" style={{ marginTop: 12 }}>
          <div>
            <label>Búsqueda general</label>
            <input value={filters.q} onChange={(e) => onChange("q", e.target.value)} placeholder="Ej: Ana, 5555, @gmail..." />
          </div>
          <div>
            <label>Puesto contiene</label>
            <input value={filters.puesto} onChange={(e) => onChange("puesto", e.target.value)} placeholder="Ej: Analista, Ventas..." />
          </div>
          <div>
            <label>Status</label>
            <select value={filters.status} onChange={(e) => onChange("status", e.target.value)}>
              <option value="">(Todos)</option>
              <option>Nuevo</option>
              <option>En revisión</option>
              <option>Shortlist</option>
              <option>Colocado</option>
            </select>
          </div>
        </div>

        <div className="row three" style={{ marginTop: 10 }}>
          <div>
            <label>Modalidad</label>
            <select value={filters.modalidad} onChange={(e) => onChange("modalidad", e.target.value)}>
              <option value="">(Todas)</option>
              <option>Presencial</option>
              <option>Híbrida</option>
              <option>Remota</option>
            </select>
          </div>
          <div>
            <label>Pretensión min</label>
            <input inputMode="numeric" value={filters.minPret} onChange={(e) => onChange("minPret", e.target.value)} />
          </div>
          <div>
            <label>Pretensión max</label>
            <input inputMode="numeric" value={filters.maxPret} onChange={(e) => onChange("maxPret", e.target.value)} />
          </div>
        </div>

        <div className="btns">
          <button className="primary" onClick={runSearch} disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
          <button onClick={() => { setFilters({ q:"", puesto:"", modalidad:"", status:"", minPret:"", maxPret:"" }); }}>
            Limpiar
          </button>
        </div>

        <div style={{ marginTop: 12 }} className="muted">
          Resultados: {rows.length}
        </div>

        <div style={{ marginTop: 12, overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Puesto</th>
                <th>Modalidad</th>
                <th>Pretensión</th>
                <th>Status</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.candidate_id}>
                  <td>
                    <Link to={`/candidato/${r.candidate_id}`} style={{ color: "var(--accent2)", fontWeight: 700 }}>
                      {r.nombre || "(sin nombre)"}
                    </Link>
                    <div className="muted">{r.correo || r.telefono || ""}</div>
                  </td>
                  <td>{r.puesto_interes || ""}</td>
                  <td>{r.modalidad || ""}</td>
                  <td>{r.pretension || ""}</td>
                  <td>{r.status || ""}</td>
                  <td className="muted">{String(r.created_at || "").slice(0, 10)}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan="6" className="muted">Sin resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Uso típico</h2>
        <div className="muted" style={{ lineHeight: 1.7 }}>
          <div>1) Registrar candidato</div>
          <div>2) Filtrar por puesto/modalidad/salario</div>
          <div>3) Abrir detalle</div>
          <div>4) Agregar nota y cambiar status</div>
        </div>
      </div>
    </div>
  );
}
