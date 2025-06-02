class ProjectService {
    constructor(projectModel) {
        this.projectModel = projectModel;
    }

    validateProjectData(data) {
        if (!data.name || !data.description) {
            throw new Error("Name and description are required.");
        }
        // Additional validation logic can be added here
    }

    async createProject(data) {
        this.validateProjectData(data);
        return await this.projectModel.createProject(data);
    }

    async getProjects(userId) {
        return await this.projectModel.getProjects(userId);
    }

    async updateProject(id, data) {
        this.validateProjectData(data);
        return await this.projectModel.updateProject(id, data);
    }

    async deleteProject(id) {
        return await this.projectModel.deleteProject(id);
    }
}

export default ProjectService;