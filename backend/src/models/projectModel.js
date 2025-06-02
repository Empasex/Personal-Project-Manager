class ProjectModel {
    constructor(db) {
        this.db = db;
    }

    createProject(projectData) {
        const { user_id, name, description, status } = projectData;
        const query = 'INSERT INTO projects (user_id, name, description, status, created_at) VALUES (?, ?, ?, ?, NOW())';
        return this.db.execute(query, [user_id, name, description, status]);
    }

getProjects(userId) {
    const query = `
        SELECT p.*, u.display_name
        FROM projects p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ?
    `;
    return this.db.execute(query, [userId]);
}

    updateProject(projectId, projectData) {
        const { name, description, status } = projectData;
        const query = 'UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?';
        return this.db.execute(query, [name, description, status, projectId]);
    }

    deleteProject(projectId) {
        const query = 'DELETE FROM projects WHERE id = ?';
        return this.db.execute(query, [projectId]);
    }
}

export default ProjectModel;