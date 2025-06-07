import { useState, useEffect } from "react";
import axios from "axios";

const ProjectDetailModal = ({ show, project, onClose, userId, setSelectedProject, refreshProjects }) => {
  if (!show || !project) return null;

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMsg, setInviteMsg] = useState("");
  const [members, setMembers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [responsable, setResponsable] = useState(project.responsable);
  const [responsableMsg, setResponsableMsg] = useState("");
  

  const isLeader = project.user_id === userId;

  useEffect(() => {
  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/projects/${project.id}/members`
      );
      setMembers(res.data);
    } catch {
      setMembers([]);
    }
  };
  if (show && project?.id) fetchMembers();
  setInviteEmail("");
  setInviteMsg("");
  setSuggestions([]);
  setShowSuggestions(false);
  setResponsable(project.responsable); // <-- aquí
  setResponsableMsg("");
}, [show, project, project.responsable]); // <-- agrega project.responsable

  const handleInviteInput = async (e) => {
    const value = e.target.value;
    setInviteEmail(value);
    if (value.length > 0) {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/users/search?q=${encodeURIComponent(value)}`
        );
        setSuggestions(res.data.filter(u => !members.some(m => m.email === u.email)));
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (email) => {
    setInviteEmail(email);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteMsg("");
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/projects/${project.id}/invite?userId=${userId}`,
        { email: inviteEmail }
      );
      setInviteMsg("Invitación enviada correctamente.");
      setInviteEmail("");
      setSuggestions([]);
      setShowSuggestions(false);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/projects/${project.id}/members`
      );
      setMembers(res.data);
    } catch (err) {
      setInviteMsg("Error al invitar usuario.");
    }
    setTimeout(() => setInviteMsg(""), 2500);
  };

  const handleRemoveMember = async (memberEmail) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/projects/${project.id}/members/${memberEmail}?userId=${userId}`
      );
      setMembers(members.filter(m => m.email !== memberEmail));
    } catch {
      alert("No se pudo eliminar el miembro.");
    }
  };

  // Recarga el proyecto desde backend tras guardar responsable
const handleSaveResponsable = async () => {
  try {
    setResponsableMsg("");
    await axios.put(
      `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/projects/${project.id}/responsable?userId=${userId}`,
      { responsable }
    );
    setResponsableMsg("Responsable actualizado correctamente.");

    // Recarga el proyecto actualizado desde backend
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/projects/${project.id}`
    );
    setResponsable(res.data.responsable);

    if (setSelectedProject) setSelectedProject({ ...res.data });

    // NUEVO: refresca la lista de proyectos en el padre
    if (typeof refreshProjects === "function") refreshProjects();

  } catch {
    setResponsableMsg("No se pudo actualizar el responsable.");
  }
  setTimeout(() => setResponsableMsg(""), 2500);
};

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}>
      <div className="bg-white p-4 rounded" style={{ minWidth: 300 }}>
        <h5>Detalles del Proyecto</h5>
        <ul className="list-unstyled">
          <li><strong>Nombre:</strong> {project.name}</li>
          <li><strong>Estado:</strong> {project.status}</li>
          <li>
            <strong>Descripción:</strong>
            <div style={{
              maxHeight: "120px",
              overflowY: "auto",
              whiteSpace: "pre-line",
              marginBottom: "0.5em",
              padding: "0.5em",
              background: "#f8f9fa",
              borderRadius: "4px"
            }}>
              {project.description}
            </div>
          </li>
          <li><strong>Prioridad:</strong> {project.prioridad}</li>
          <li><strong>Fecha de creación:</strong> {project.created_at ? new Date(project.created_at).toLocaleString() : "N/A"}</li>
          <li><strong>Creador:</strong> {project.display_name || "Desconocido"}</li>
        </ul>
        <div className="mb-2">
          <strong>Miembros del proyecto:</strong>
          <ul>
            {members.map((m, idx) => (
              <li key={idx}>
                {m.display_name} <span className="text-muted">({m.email})</span>
                {isLeader && m.user_id !== userId && (
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => handleRemoveMember(m.email)}
                    type="button"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Selector de responsable fuera del <ul> */}
        {isLeader && (
          <div className="mb-2 d-flex align-items-center">
            <strong className="me-2">Responsable:</strong>
            <select
              className="form-select d-inline w-auto"
              value={responsable || ""}
              onChange={e => setResponsable(e.target.value)}
            >
              <option value="">Selecciona responsable</option>
              {members.map((m) => (
                <option key={m.email} value={m.display_name}>
                  {m.display_name} ({m.email})
                </option>
              ))}
            </select>
            <button
              className="btn btn-success btn-sm ms-2"
              onClick={handleSaveResponsable}
              disabled={!responsable}
              type="button"
            >
              Guardar
            </button>
          </div>
        )}

        {isLeader && (
          <form className="mb-2" onSubmit={handleInvite}>
            <label>Invitar usuario por email:</label>
            <div className="position-relative">
              <input
                type="email"
                className="form-control"
                value={inviteEmail}
                onChange={handleInviteInput}
                placeholder="Email del invitado"
                required
                autoComplete="off"
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                  {suggestions.map((s, idx) => (
                    <li
                      key={idx}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
                      onMouseDown={() => handleSuggestionClick(s.email)}
                    >
                      {s.display_name ? `${s.display_name} (${s.email})` : s.email}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="d-flex align-items-center mt-2">
              <button type="submit" className="btn btn-primary">Invitar</button>
              {responsableMsg && (
                <span className="ms-2" style={{ color: responsableMsg.includes("correctamente") ? "green" : "red" }}>
                  {responsableMsg}
                </span>
              )}
              {inviteMsg && (
                <span className="ms-2" style={{ whiteSpace: "nowrap" }}>{inviteMsg}</span>
              )}
            </div>
          </form>
        )}
        <button className="btn btn-secondary mt-2" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ProjectDetailModal;