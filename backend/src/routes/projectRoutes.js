import { Router } from 'express';
import ProjectModel from '../models/projectModel.js';
import ProjectService from '../services/projectService.js';
import ProjectController from '../controllers/projectController.js';

export default function projectRoutes(db) {
    const router = Router();
    const projectModel = new ProjectModel(db);
    const projectService = new ProjectService(projectModel);
    const projectController = new ProjectController(projectService);

    router.post('/', projectController.createProject.bind(projectController));
    router.get('/', projectController.getProjects.bind(projectController));
    router.put('/:id', projectController.updateProject.bind(projectController));
    router.delete('/:id', projectController.deleteProject.bind(projectController));
    router.post('/:id/invite', projectController.addUserToProject.bind(projectController));
    router.get('/:id/members', projectController.getProjectMembers.bind(projectController));
    
    return router;
}