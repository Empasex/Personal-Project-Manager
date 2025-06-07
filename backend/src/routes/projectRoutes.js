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
    router.get('/:id', projectController.getProjectById.bind(projectController));
    router.put('/:id/responsable', projectController.updateResponsable.bind(projectController));
    router.delete('/:id/members/:email', async (req, res) => {
    const projectId = req.params.id;
    const memberEmail = req.params.email;
    const userId = req.query.userId || 1;

    // Solo el líder puede eliminar
    const [rows] = await db.query('SELECT user_id FROM projects WHERE id = ?', [projectId]);
    if (!rows.length || rows[0].user_id != userId) {
        return res.status(403).json({ message: "Solo el líder puede eliminar miembros." });
    }

    // No permitas que el líder se elimine a sí mismo
    const [userRows] = await db.query('SELECT id FROM users WHERE email = ?', [memberEmail]);
    if (!userRows.length) {
        return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const memberId = userRows[0].id;
    if (memberId == userId) {
        return res.status(400).json({ message: "El líder no puede eliminarse a sí mismo." });
    }

    await db.query('DELETE FROM project_users WHERE project_id = ? AND user_id = ?', [projectId, memberId]);
    res.json({ success: true });
});
    return router;
}