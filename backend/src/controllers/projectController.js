class ProjectController {
    constructor(projectService) {
        this.projectService = projectService;
    }

    async createProject(req, res) {
        try {
            const projectData = req.body;
            const newProject = await this.projectService.createProject(projectData);
            res.status(201).json(newProject);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProjects(req, res) {
        try {
            // Puedes obtener el userId de req.user si usas autenticación
            const userId = req.query.userId || 1; // ejemplo
            const [projects] = await this.projectService.getProjects(userId);
            res.status(200).json(projects);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateProject(req, res) {
        try {
            const projectId = req.params.id;
            const projectData = req.body;
            const updatedProject = await this.projectService.updateProject(projectId, projectData);
            res.status(200).json(updatedProject);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteProject(req, res) {
        try {
            const projectId = req.params.id;
            // Solo el líder puede eliminar
            const [rows] = await this.projectService.projectModel.db.execute(
                'SELECT user_id FROM projects WHERE id = ?', [projectId]
            );
            // Aquí debes obtener el userId autenticado, por ejemplo de req.user.id
            const userId = req.query.userId || 1; // <-- ajusta según tu auth
            if (!rows.length || rows[0].user_id != userId) {
                return res.status(403).json({ message: "Solo el líder puede eliminar el proyecto." });
            }
            await this.projectService.deleteProject(projectId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async addUserToProject(req, res) {
        try {
            const projectId = req.params.id;
            const { email } = req.body;
            // Solo el líder puede invitar
            const [rows] = await this.projectService.projectModel.db.execute(
                'SELECT user_id FROM projects WHERE id = ?', [projectId]
            );
            const userId = req.query.userId || 1; // <-- ajusta según tu auth
            if (!rows.length || rows[0].user_id != userId) {
                return res.status(403).json({ message: "Solo el líder puede invitar usuarios." });
            }
            // Busca el user_id por email
            const [userRows] = await this.projectService.projectModel.db.execute(
                'SELECT id FROM users WHERE email = ?', [email]
            );
            if (userRows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            const invitedUserId = userRows[0].id;
            await this.projectService.projectModel.addUserToProject(projectId, invitedUserId);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProjectMembers(req, res) {
        try {
            const projectId = req.params.id;
            const [rows] = await this.projectService.projectModel.db.execute(
                `SELECT u.display_name, u.email FROM users u
                 JOIN project_users pu ON pu.user_id = u.id
                 WHERE pu.project_id = ?`, [projectId]
            );
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ProjectController;