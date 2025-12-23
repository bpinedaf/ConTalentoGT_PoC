import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Form from "./pages/Form";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Toast from "./components/Toast";
import { useState } from "react";
import "./styles/app.css";

export default function App() {
  const [toast, setToast] = useState(null);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Form setToast={setToast} />} />
        <Route path="/consulta" element={<Search setToast={setToast} />} />
        <Route path="/candidato/:id" element={<Detail setToast={setToast} />} />
      </Routes>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </Layout>
  );
}
