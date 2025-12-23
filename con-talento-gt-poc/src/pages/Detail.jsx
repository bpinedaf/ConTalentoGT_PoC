import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addNote, getCandidate, setStatus } from "../api/api";

export default function Detail({ setToast }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const [note, setNote] = useState("");
  const [autor, setAutor] = useState("Con Talento GT");

  async function refresh() {
    setLoading(true);
    try {
      const r = await getCandidate(id);
      if (!r.ok) throw new Error(r.error || "No encontrado");
      setData(r.data);
    } catch (e) {
      setToast({ type: "err", message: String(e) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [id]);

  async function onAddNote() {
    if (!note.trim()) return;
    try {
      const r = await addNote(id, autor, note.trim());
      if (!r.ok) throw new Error(r.error || "No se pudo guardar nota");
      setToast({ type: "ok", message: "Nota agregada" });
      setNote("");
      refresh();
    } catch (e) {
      setToast({ type: "err", message: String(e) });
    }
  }

  async function onSetStatus(status) {
    try {
      const r = await setStatus(id, status);
      if (!r.ok) throw new Error(r.error || "No se pudo cambiar status");
      setToast({ type: "ok", message: `Status → ${status}` });
      refresh();
    } catch (e) {
      setToast({ type: "err", message: String(e) });
    }
  }

  if (loading) {
    return <div className="card" style={{ marginTop: 14 }}>Cargando...</div>;
  }
  if (!data) {
    return <div className="card" style={{ marginTop: 14 }}>No encontrado</div>;
  }

  const c = data.candidato || {};

  return (
    <div className="grid two">
      <div className="card">
        <h2>Detalle del candidato</h2>
        <div className="muted">ID: {c.candidate_id}</div>

        <div style={{ marginTop: 12 }} className="row two">
          <div>
            <label>Nombre</label>
            <input value={c.nombre || ""} readOnly />
          </div>
          <div>
            <label>Status</label>
            <input value={c.status || ""} readOnly />
          </div>
        </div>

        <div className="row two">
          <div>
            <label>Correo</label>
            <input value={c.correo || ""} readOnly />
          </div>
          <div>
            <label>Teléfono</label>
            <input value={c.telefono || ""} readOnly />
          </div>
        </div>

        <div className="row three">
          <div>
            <label>Puesto interés</label>
            <input value={c.puesto_interes || ""} readOnly />
          </div>
          <div>
            <label>Modalidad</label>
            <input value={c.modalidad || ""} readOnly />
          </div>
          <div>
            <label>Pretensión</label>
            <input value={c.pretension || ""} readOnly />
          </div>
        </div>

        <div className="btns">
          <button onClick={() => onSetStatus("Nuevo")}>Nuevo</button>
          <button onClick={() => onSetStatus("En revisión")}>En revisión</button>
          <button onClick={() => onSetStatus("Shortlist")}>Shortlist</button>
          <button className="primary" onClick={() => onSetStatus("Colocado")}>Colocado</button>
        </div>

        <div style={{ marginTop: 16 }}>
          <h2>Experiencia</h2>
          {!data.experiencia?.length && <div className="muted">Sin registros</div>}
          {data.experiencia?.map((e) => (
            <div key={e.exp_id} className="card" style={{ background: "rgba(15,23,48,.65)", marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <strong>{e.empresa || "(empresa)"}</strong>
                <span className="muted">{e.inicio || ""} → {e.fin || ""}</span>
              </div>
              <div className="muted">{e.puesto || ""}</div>
              {e.logros && <div style={{ marginTop: 8 }}>{e.logros}</div>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <h2>Competencias</h2>
          {!data.competencias?.length && <div className="muted">Sin registros (en PoC las agregamos en fase siguiente)</div>}
          {data.competencias?.map((x) => (
            <div key={x.comp_id} className="card" style={{ background: "rgba(15,23,48,.65)", marginTop: 10 }}>
              <strong>{x.competencia}</strong>
              <div className="muted">{x.pregunta}</div>
              <div style={{ marginTop: 8 }}>{x.respuesta_star}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Notas internas</h2>

        <div className="row two" style={{ marginTop: 10 }}>
          <div>
            <label>Autor</label>
            <input value={autor} onChange={(e) => setAutor(e.target.value)} />
          </div>
          <div>
            <label>Agregar nota</label>
            <button className="primary" onClick={onAddNote}>Guardar nota</button>
          </div>
        </div>

        <div>
          <label>Texto</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej: Excelente comunicación, disponible inmediato..." />
        </div>

        <div style={{ marginTop: 14 }}>
          <h2>Historial</h2>
          {!data.notas?.length && <div className="muted">Sin notas</div>}
          {data.notas?.map((n) => (
            <div key={n.note_id} className="card" style={{ background: "rgba(15,23,48,.65)", marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <strong>{n.autor}</strong>
                <span className="muted">{String(n.created_at || "").slice(0, 19).replace("T", " ")}</span>
              </div>
              <div style={{ marginTop: 8 }}>{n.nota}</div>
            </div>
          ))}
        </div>

        <div className="btns">
          <button onClick={refresh}>Refrescar</button>
        </div>
      </div>
    </div>
  );
}
