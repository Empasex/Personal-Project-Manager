import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../services/api';
import ProjectDetailModal from './ProjectDetailModal';
import { deleteProject } from "../services/api";


const prioridadOrden = { 'Alta': 1, 'Media': 2, 'Baja': 3 };

const ProjectList = ({ userId, onEditProject, refresh, page = 1, setTotalProjects, projectsPerPage = 8 }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para el modal de detalles
    const [selectedProject, setSelectedProject] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const loadProjects = async () => {
        setLoading(true);
        try {
            // fetchProjects debe aceptar page y limit
            const res = await fetchProjects(userId, page, projectsPerPage);
            setProjects(res.projects);
            setTotalProjects && setTotalProjects(res.total);
        } catch (err) {
            setError('Failed to load projects');
            setProjects([]);
            setTotalProjects && setTotalProjects(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
        // eslint-disable-next-line
    }, [userId, refresh, page, projectsPerPage]);

    const handleShowDetails = (project) => {
        setSelectedProject(project);
        setShowDetailModal(true);
    };

    const handleCloseDetails = () => {
        setShowDetailModal(false);
        setSelectedProject(null);
    };

const handleDelete = async (projectId) => {
    try {
        await deleteProject(projectId, userId);
        await loadProjects(); // Esto recarga la lista inmediatamente
        setShowDetailModal(false); // Cierra el modal si está abierto
        setSelectedProject(null); // Limpia el proyecto seleccionado
    } catch {
        alert("No se pudo eliminar el proyecto.");
    }
};
    // Ordenar por prioridad
    const sortedProjects = [...projects].sort(
        (a, b) => (prioridadOrden[a.prioridad] || 4) - (prioridadOrden[b.prioridad] || 4)
    );

    return (
        <div className="container mt-4">
            {loading ? (
                <div className="alert alert-info">Cargando...</div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <ul className="list-group">
                    {sortedProjects && sortedProjects.length > 0 ? (
                        sortedProjects.map(project => (
                            <li
                                className="list-group-item mb-2"
                                key={project.id}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleShowDetails(project)}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{project.name}</strong>
                                        <span
                                            className={
                                                "ms-3 badge " +
                                                (project.status === "Realizado"
                                                    ? "bg-success"
                                                    : project.status === "En Progreso"
                                                    ? "bg-warning text-dark"
                                                    : project.status === "Pendiente"
                                                    ? "bg-danger"
                                                    : "bg-secondary")
                                            }
                                        >
                                            {project.status}
                                        </span>
                                        <span className="ms-3 badge bg-info text-dark">
                                            {project.prioridad}
                                        </span>
                                    </div>
                                    <div>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={e => { e.stopPropagation(); onEditProject && onEditProject(project); }}
                                        >
                                            Editar
                                        </button>
                                        {userId === project.user_id && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={e => { e.stopPropagation(); handleDelete(project.id); }}
                                        >
                                            Eliminar
                                        </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item">No hay proyectos.</li>
                    )}
                </ul>
            )}

            {/* Modal de detalles */}
            <ProjectDetailModal
                show={showDetailModal}
                project={selectedProject}
                onClose={handleCloseDetails}
                userId={userId}
                setSelectedProject={setSelectedProject} // <-- Solo agregas esta línea
                refreshProjects={loadProjects} // <-- agrega esto

            />
        </div>
    );
};

export default ProjectList;