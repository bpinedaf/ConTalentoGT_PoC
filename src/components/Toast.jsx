export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type === "ok" ? "ok" : "err"}`} onClick={onClose}>
      <strong style={{ display: "block", marginBottom: 4 }}>
        {toast.type === "ok" ? "Listo" : "Atención"}
      </strong>
      <div>{toast.message}</div>
      <div className="muted" style={{ marginTop: 6 }}>
        (click para cerrar)
      </div>
    </div>
  );
}
