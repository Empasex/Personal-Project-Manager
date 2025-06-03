import React, { useEffect, useState } from 'react';
import { fetchProjects, createProject, updateProject, deleteProject } from '../services/api';
import ProjectDetailModal from './ProjectDetailModal';

const ProjectList = ({ userId }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        name: '',
        description: '',
        status: '',
        user_id: userId
    });
    const [editingId, setEditingId] = useState(null);

    // Nuevo estado para el modal de detalles
    const [selectedProject, setSelectedProject] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const fetchedProjects = await fetchProjects(userId);
            setProjects(fetchedProjects);
        } catch (err) {
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, [userId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateProject(editingId, { ...form, user_id: userId });
            } else {
                await createProject({ ...form, user_id: userId });
            }
            setForm({ name: '', description: '', status: '', user_id: userId });
            setEditingId(null);
            await loadProjects();
        } catch (err) {
            setError('Failed to save project');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProject(id);
            await loadProjects();
        } catch (err) {
            setError('Failed to delete project');
        }
    };

    const handleEdit = (project) => {
        setForm({
            name: project.name,
            description: project.description,
            status: project.status,
            user_id: project.user_id
        });
        setEditingId(project.id);
    };

    const handleCancelEdit = () => {
        setForm({ name: '', description: '', status: '', user_id: userId });
        setEditingId(null);
    };

    // Nuevo: abrir modal de detalles
const handleShowDetails = (project) => {
  console.log("Abriendo modal para:", project);
  setSelectedProject(project);
  setShowDetailModal(true);
};

    const handleCloseDetails = () => {
        setShowDetailModal(false);
        setSelectedProject(null);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">{editingId ? 'Editar Proyecto' : 'Crear Proyecto'}</h2>
            <form className="row g-2 mb-4" onSubmit={handleSubmit}>
                <div className="col-md-3">
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Nombre"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        name="description"
                        className="form-control"
                        placeholder="Descripción"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <select
                        name="status"
                        className="form-control"
                        value={form.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona estado</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Realizado">Realizado</option>
                    </select>
                </div>
                <div className="col-md-2 d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        {editingId ? 'Actualizar' : 'Crear'}
                    </button>
                    {editingId && (
                        <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <h2 className="mb-3">Project List</h2>
            {loading ? (
                <div className="alert alert-info">Cargando...</div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <ul className="list-group">
                    {projects && projects.length > 0 ? (
                        projects.map(project => (
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
                                    </div>
                                    <div>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={e => { e.stopPropagation(); handleEdit(project); }}
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
            />
        </div>
    );
};

export default ProjectList;