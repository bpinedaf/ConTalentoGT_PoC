import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Layout({ children }) {
  return (
    <div className="container">
      <div className="nav">
        <div className="brand">
          <img src={logo} alt="Con Talento GT" />
          <div className="title">
            <strong>Con Talento GT</strong>
            <span>PoC • Registro y consulta de candidatos</span>
          </div>
        </div>

        <div className="navlinks">
          <NavLink to="/" className={({ isActive }) => `pill ${isActive ? "active" : ""}`}>Inicio</NavLink>
          <NavLink to="/registro" className={({ isActive }) => `pill ${isActive ? "active" : ""}`}>Registro</NavLink>
          <NavLink to="/consulta" className={({ isActive }) => `pill ${isActive ? "active" : ""}`}>Consulta</NavLink>
        </div>
      </div>

      {children}

      <div className="muted" style={{ marginTop: 14, paddingBottom: 18 }}>
        Backend: Google Sheets + Apps Script • Frontend: React + Netlify
      </div>
    </div>
  );
}
