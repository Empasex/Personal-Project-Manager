import React, { useEffect, useState } from 'react';
import ProjectList from '../components/ProjectList';
import { fetchProjects } from '../services/api';
import { useNavigate } from "react-router-dom";

const Dashboard = ({ userId }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshList, setRefreshList] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true);
            try {
                const data = await fetchProjects(userId);
                setProjects(data);
            } catch {
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };
        if (userId) loadProjects();
    }, [userId, refreshList]);

    // Calcula los totales
    const total = projects.length;
    const pendientes = projects.filter(p => p.status === "Pendiente").length;
    const enProgreso = projects.filter(p => p.status === "En Progreso").length;
    const realizados = projects.filter(p => p.status === "Realizado").length;

    // Cuando se edita, navega a la ruta con el id
    const handleEditProject = (project) => {
        navigate(`/editar-proyecto/${project.id}`);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Dashboard</h1>
            <div className="project-summary mb-4">
                <div className="summary-card total">
                    <div className="summary-title">Total</div>
                    <div className="summary-value">{total}</div>
                </div>
                <div className="summary-card pendientes">
                    <div className="summary-title">Pendientes</div>
                    <div className="summary-value">{pendientes}</div>
                </div>
                <div className="summary-card progreso">
                    <div className="summary-title">En Progreso</div>
                    <div className="summary-value">{enProgreso}</div>
                </div>
                <div className="summary-card realizados">
                    <div className="summary-title">Realizados</div>
                    <div className="summary-value">{realizados}</div>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Project List</h2>
                <button className="btn btn-primary" onClick={() => navigate("/crear-proyecto")}>
                    Crear Proyecto
                </button>
            </div>
            <ProjectList
                userId={userId}
                onEditProject={handleEditProject}
                refresh={refreshList}
            />
        </div>
    );
};

export default Dashboard;