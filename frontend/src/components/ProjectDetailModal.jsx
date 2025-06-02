
const ProjectDetailModal = ({ show, project, onClose }) => {
  if (!show || !project) return null;

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
        <button className="btn btn-secondary mt-2" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ProjectDetailModal;