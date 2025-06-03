import { useState, useEffect } from "react";
import axios from "axios";

const ProjectDetailModal = ({ show, project, onClose, userId }) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMsg, setInviteMsg] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (show && project) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/projects/${project.id}/members`
          );
          setMembers(res.data);
        } catch {
          setMembers([]);
        }
      }
    };
    fetchMembers();
  }, [show, project]);

  if (!show || !project) return null;

  // Solo el líder puede invitar (userId === project.user_id)
  const isLeader = userId === project.user_id;

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteMsg("");
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/projects/${project.id}/invite?userId=${userId}`,
        { email: inviteEmail }
      );
      setInviteMsg("Usuario invitado correctamente.");
      setInviteEmail("");
      // Refresca la lista de miembros
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/projects/${project.id}/members`
      );
      setMembers(res.data);
    } catch (err) {
      setInviteMsg("No se pudo invitar al usuario.");
    }
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
              marginTop: "0.5em",
              padding: "0.5em",
              background: "#f8f9fa",
              borderRadius: "4px"
            }}>
              {project.description}
            </div>
          </li>
          <li><strong>Fecha de creación:</strong> {project.created_at ? new Date(project.created_at).toLocaleString() : "N/A"}</li>
          <li><strong>Creador:</strong> {project.display_name || "Desconocido"}</li>
        </ul>
        <div className="mb-2">
          <strong>Miembros del proyecto:</strong>
          <ul>
            {members.map((m, idx) => (
              <li key={idx}>{m.display_name} <span className="text-muted">({m.email})</span></li>
            ))}
          </ul>
        </div>
        {isLeader && (
          <form className="mb-2" onSubmit={handleInvite}>
            <label>Invitar usuario por email:</label>
            <div className="d-flex gap-2">
              <input
                type="email"
                className="form-control"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="Email del invitado"
                required
              />
              <button type="submit" className="btn btn-primary">Invitar</button>
            </div>
            {inviteMsg && <div className="mt-2">{inviteMsg}</div>}
          </form>
        )}
        <button className="btn btn-secondary mt-2" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ProjectDetailModal;