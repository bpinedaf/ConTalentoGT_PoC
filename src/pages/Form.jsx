import { useState } from "react";
import { createCandidate } from "../api/api";

const MODALIDADES = ["Presencial", "Híbrida", "Remota"];
const STATUS = ["Nuevo", "En revisión", "Shortlist", "Colocado"];

export default function Form({ setToast }) {
  const [saving, setSaving] = useState(false);

  const [candidato, setCandidato] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    puesto_interes: "",
    modalidad: "Remota",
    pretension: "",
    ubicacion: "",
    industria: "",
    licencia_conducir: "",
    disponibilidad_viajar_interior: "",
    disponibilidad_viajar_extranjero: "",
    visa_vigente: "",
    status: "Nuevo",
    observaciones: "",
  });

  const [experiencia, setExperiencia] = useState([
    { empresa: "", puesto: "", inicio: "", fin: "", logros: "" },
  ]);

  function onChange(field, value) {
    setCandidato((p) => ({ ...p, [field]: value }));
  }

  function updateExp(i, field, value) {
    setExperiencia((arr) => arr.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  }

  function addExp() {
    setExperiencia((arr) => [...arr, { empresa: "", puesto: "", inicio: "", fin: "", logros: "" }]);
  }

  function removeExp(i) {
    setExperiencia((arr) => arr.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!candidato.nombre.trim()) {
      setToast({ type: "err", message: "Nombre es requerido" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        candidato: {
          ...candidato,
          pretension: candidato.pretension ? Number(candidato.pretension) : "",
        },
        experiencia: experiencia.filter((x) => (x.empresa || x.puesto || x.logros).trim !== ""),
        competencias: [],
      };
      const r = await createCandidate(payload);
      if (!r.ok) throw new Error(r.error || "No se pudo guardar");

      setToast({ type: "ok", message: `Guardado. ID: ${r.data.candidate_id}` });

      // Reset mínimo
      setCandidato((p) => ({ ...p, nombre: "", telefono: "", correo: "", observaciones: "" }));
    } catch (err) {
      setToast({ type: "err", message: String(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Registro de candidato</h2>
        <div className="muted">Captura rápida (PoC). Luego ampliamos secciones del formato completo.</div>

        <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
          <div className="row two">
            <div>
              <label>Nombre completo *</label>
              <input value={candidato.nombre} onChange={(e) => onChange("nombre", e.target.value)} />
            </div>
            <div>
              <label>Status</label>
              <select value={candidato.status} onChange={(e) => onChange("status", e.target.value)}>
                {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="row two">
            <div>
              <label>Teléfono / WhatsApp</label>
              <input value={candidato.telefono} onChange={(e) => onChange("telefono", e.target.value)} />
            </div>
            <div>
              <label>Correo</label>
              <input value={candidato.correo} onChange={(e) => onChange("correo", e.target.value)} />
            </div>
          </div>

          <div className="row two">
            <div>
              <label>Puesto de interés</label>
              <input value={candidato.puesto_interes} onChange={(e) => onChange("puesto_interes", e.target.value)} />
            </div>
            <div>
              <label>Modalidad</label>
              <select value={candidato.modalidad} onChange={(e) => onChange("modalidad", e.target.value)}>
                {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="row three">
            <div>
              <label>Pretensión salarial (mensual)</label>
              <input inputMode="numeric" value={candidato.pretension} onChange={(e) => onChange("pretension", e.target.value)} />
            </div>
            <div>
              <label>Ubicación / zona</label>
              <input value={candidato.ubicacion} onChange={(e) => onChange("ubicacion", e.target.value)} />
            </div>
            <div>
              <label>Industria preferida</label>
              <input value={candidato.industria} onChange={(e) => onChange("industria", e.target.value)} />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <h2 style={{ marginBottom: 6 }}>Experiencia (rápida)</h2>
            <div className="muted">Agrega 1–2 empleos recientes (PoC).</div>
          </div>

          {experiencia.map((exp, i) => (
            <div key={i} className="card" style={{ background: "rgba(15,23,48,.65)", marginTop: 12 }}>
              <div className="row two">
                <div>
                  <label>Empresa</label>
                  <input value={exp.empresa} onChange={(e) => updateExp(i, "empresa", e.target.value)} />
                </div>
                <div>
                  <label>Puesto</label>
                  <input value={exp.puesto} onChange={(e) => updateExp(i, "puesto", e.target.value)} />
                </div>
              </div>
              <div className="row two">
                <div>
                  <label>Inicio (YYYY-MM)</label>
                  <input value={exp.inicio} onChange={(e) => updateExp(i, "inicio", e.target.value)} />
                </div>
                <div>
                  <label>Fin (YYYY-MM)</label>
                  <input value={exp.fin} onChange={(e) => updateExp(i, "fin", e.target.value)} />
                </div>
              </div>
              <div>
                <label>Logros</label>
                <textarea value={exp.logros} onChange={(e) => updateExp(i, "logros", e.target.value)} />
              </div>

              <div className="btns">
                {experiencia.length > 1 && (
                  <button type="button" className="danger" onClick={() => removeExp(i)}>Eliminar</button>
                )}
              </div>
            </div>
          ))}

          <div className="btns">
            <button type="button" onClick={addExp}>+ Agregar empleo</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <label>Observaciones</label>
            <textarea value={candidato.observaciones} onChange={(e) => onChange("observaciones", e.target.value)} />
          </div>

          <div className="btns">
            <button className="primary" disabled={saving}>
              {saving ? "Guardando..." : "Guardar candidato"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Tips de PoC</h2>
        <div className="muted" style={{ lineHeight: 1.7 }}>
          <div>• Mantuvimos el registro “ligero” para demostrar valor rápido.</div>
          <div>• En la siguiente fase ampliamos secciones del formato completo (competencias, salud, etc.).</div>
          <div>• La consulta + detalle es donde ocurre el “wow”.</div>
        </div>
      </div>
    </div>
  );
}
