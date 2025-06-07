import React, { useEffect, useState } from 'react';
import ProjectList from '../components/ProjectList';
import { fetchProjects } from '../services/api';
import { useNavigate } from "react-router-dom";

const PROJECTS_PER_PAGE = 8;

const Dashboard = ({ userId }) => {
    const [page, setPage] = useState(1);
    const [totalProjects, setTotalProjects] = useState(0);
    const [refreshList, setRefreshList] = useState(false);

    // NUEVO: Estado para el resumen
    const [summary, setSummary] = useState({
        total: 0,
        pendientes: 0,
        progreso: 0,
        realizados: 0
    });

    const navigate = useNavigate();

    // Cuando se edita, navega a la ruta con el id
    const handleEditProject = (project) => {
        navigate(`/editar-proyecto/${project.id}`);
    };

    // Para refrescar la lista desde hijos
    const handleRefresh = () => setRefreshList(r => !r);

    const totalPages = Math.max(1, Math.ceil(totalProjects / PROJECTS_PER_PAGE));

    // NUEVO: Cargar resumen de proyectos (sin paginación)
    useEffect(() => {
        const loadSummary = async () => {
            try {
                // Trae todos los proyectos del usuario (limit grande para evitar paginación)
                const res = await fetchProjects(userId, 1, 1000);
                const proyectos = res.projects || [];
                setSummary({
                    total: proyectos.length,
                    pendientes: proyectos.filter(p => p.status === "Pendiente").length,
                    progreso: proyectos.filter(p => p.status === "En Progreso").length,
                    realizados: proyectos.filter(p => p.status === "Realizado").length
                });
            } catch {
                setSummary({ total: 0, pendientes: 0, progreso: 0, realizados: 0 });
            }
        };
        if (userId) loadSummary();
    }, [userId, refreshList]);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Panel de Proyectos</h1>
            {/* NUEVO: Resumen */}
            <div className="project-summary">
                <div className="summary-card total">
                    <div className="summary-title">Total</div>
                    <div className="summary-value">{summary.total}</div>
                </div>
                <div className="summary-card pendientes">
                    <div className="summary-title">Pendientes</div>
                    <div className="summary-value">{summary.pendientes}</div>
                </div>
                <div className="summary-card progreso">
                    <div className="summary-title">En Progreso</div>
                    <div className="summary-value">{summary.progreso}</div>
                </div>
                <div className="summary-card realizados">
                    <div className="summary-title">Realizados</div>
                    <div className="summary-value">{summary.realizados}</div>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Listado de Proyectos</h2>
                <button className="btn btn-primary" onClick={() => navigate("/crear-proyecto")}>
                    Crear Proyecto
                </button>
            </div>
            <ProjectList
                userId={userId}
                onEditProject={handleEditProject}
                refresh={refreshList}
                setRefresh={handleRefresh} // <-- agrega esto
                page={page}
                setTotalProjects={setTotalProjects}
                projectsPerPage={PROJECTS_PER_PAGE}
            />
            <div className="d-flex justify-content-center my-3">
                <button
                    className="btn btn-outline-secondary mx-1"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Anterior
                </button>
                <span className="mx-2">Página {page} de {totalPages}</span>
                <button
                    className="btn btn-outline-secondary mx-1"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default Dashboard;