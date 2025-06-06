class ProjectModel {
    constructor(db) {
        this.db = db;
    }

    // Crea el proyecto y retorna el resultado (para obtener el insertId)
    async createProject(projectData) {
        const { user_id, name, description, status, prioridad, responsable } = projectData;
        const query = 'INSERT INTO projects (user_id, name, description, status, prioridad, responsable, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';
        const [result] = await this.db.execute(query, [user_id, name, description, status, prioridad, responsable]);
        await this.db.execute('INSERT INTO project_users (project_id, user_id) VALUES (?, ?)', [result.insertId, user_id]);
        return result;
    }

    // Trae todos los proyectos donde el usuario es miembro
    getProjects(userId) {
        const query = `
            SELECT p.*, u.display_name
            FROM projects p
            JOIN users u ON p.user_id = u.id
            JOIN project_users pu ON pu.project_id = p.id
            WHERE pu.user_id = ?
        `;
        return this.db.execute(query, [userId]);
    }

    // Agrega un usuario invitado al proyecto
    addUserToProject(projectId, userId) {
        const query = 'INSERT IGNORE INTO project_users (project_id, user_id) VALUES (?, ?)';
        return this.db.execute(query, [projectId, userId]);
    }

        updateProject(projectId, projectData) {
            const { name, description, status, prioridad, responsable } = projectData;
            const query = 'UPDATE projects SET name = ?, description = ?, status = ?, prioridad = ?, responsable = ? WHERE id = ?';
            return this.db.execute(query, [name, description, status, prioridad, responsable, projectId]);
        }

    deleteProject(projectId) {
        const query = 'DELETE FROM projects WHERE id = ?';
        return this.db.execute(query, [projectId]);
    }
}

export default ProjectModel;