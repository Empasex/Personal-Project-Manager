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
            res.status(200).json(projects); // <-- Solo el array de proyectos, no el array anidado
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
            await this.projectService.deleteProject(projectId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ProjectController;