import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProject, updateProject, fetchProjects, fetchProjectById } from "../services/api";

const estados = ["Pendiente", "En Progreso", "Realizado"];
const prioridades = ["Baja", "Media", "Alta"];

const ProjectForm = ({ userId }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "",
    prioridad: "",
    responsable: "",
    user_id: userId,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

useEffect(() => {
    const loadProject = async () => {
        if (id) {
            setLoading(true);
            try {
                const project = await fetchProjectById(id);
                setForm({
                    name: project.name || "",
                    description: project.description || "",
                    status: project.status || "",
                    prioridad: project.prioridad || "",
                    responsable: project.responsable || "",
                    user_id: userId,
                });
            } catch {
                setError("No se pudo cargar el proyecto");
            } finally {
                setLoading(false);
            }
        }
    };
    loadProject();
}, [id, userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateProject(id, { ...form, user_id: userId });
      } else {
        await createProject({ ...form, user_id: userId });
      }
      navigate("/");
    } catch (err) {
      setError("Error al guardar el proyecto");
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Proyecto" : "Crear Proyecto"}</h2>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Estado</label>
          <select
            name="status"
            className="form-control"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona estado</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-12">
          <label className="form-label">Descripción</label>
          <textarea
            name="description"
            className="form-control"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Prioridad</label>
          <select
            name="prioridad"
            className="form-control"
            value={form.prioridad}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona prioridad</option>
            {prioridades.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            {id ? "Actualizar" : "Crear"}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate("/")}
          >
            Cancelar
          </button>
        </div>
        {error && (
          <div className="alert alert-danger mt-2">{error}</div>
        )}
      </form>
    </div>
  );
};

export default ProjectForm;