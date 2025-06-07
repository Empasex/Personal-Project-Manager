import nodemailer from "nodemailer";

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
        const userId = Number(req.query.userId) || 1;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;
        const offset = (page - 1) * limit;

        // Total de proyectos donde el usuario es miembro
        const [countRows] = await this.projectService.projectModel.db.execute(
            `SELECT COUNT(*) as total
            FROM projects p
            JOIN project_users pu ON pu.project_id = p.id
            WHERE pu.user_id = ?`, [userId]
        );
        const total = countRows[0].total;

        // Aquí agregas el ORDER BY
        const [projects] = await this.projectService.projectModel.db.execute(
            `SELECT p.*, u.display_name
            FROM projects p
            JOIN users u ON p.user_id = u.id
            JOIN project_users pu ON pu.project_id = p.id
            WHERE pu.user_id = ?
            ORDER BY p.id DESC
            LIMIT ${limit} OFFSET ${offset}`, [userId]
        );

        res.status(200).json({ projects, total });
    } catch (error) {
        console.error(error);
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
            const [rows] = await this.projectService.projectModel.db.execute(
                'SELECT user_id FROM projects WHERE id = ?', [projectId]
            );
            const userId = req.query.userId || 1;
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
            const [rows] = await this.projectService.projectModel.db.execute(
                'SELECT user_id, name FROM projects WHERE id = ?', [projectId]
            );
            const userId = req.query.userId || 1;
            if (!rows.length || rows[0].user_id != userId) {
                return res.status(403).json({ message: "Solo el líder puede invitar usuarios." });
            }
            const [userRows] = await this.projectService.projectModel.db.execute(
                'SELECT id FROM users WHERE email = ?', [email]
            );
            if (userRows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            const invitedUserId = userRows[0].id;
            await this.projectService.projectModel.addUserToProject(projectId, invitedUserId);

            // --- ENVÍO DE CORREO ---
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'empanaditalol@gmail.com',
                    pass: 'uqak aubt pnop unyt'
                }
            });

            const mailOptions = {
                from: 'empanaditalol@gmail.com',
                to: email,
                subject: 'Has sido invitado a un proyecto',
                text: `Hola, has sido invitado al proyecto "${rows[0].name}".\n\nIngresa a la plataforma para ver los detalles:\nhttps://d3ejww12j2glsc.cloudfront.net/`
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (err) {
                console.error("Error enviando correo:", err);
            }
            // --- FIN ENVÍO DE CORREO ---

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProjectMembers(req, res) {
        try {
            const projectId = req.params.id;
            const [rows] = await this.projectService.projectModel.db.execute(
                `SELECT u.display_name, u.email, u.id as user_id
                FROM users u
                JOIN project_users pu ON pu.user_id = u.id
                WHERE pu.project_id = ?`, [projectId]
            );
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // NUEVO: Cambiar responsable del proyecto
    async updateResponsable(req, res) {
        try {
            const projectId = req.params.id;
            const { responsable } = req.body;
            const userId = req.query.userId || 1;

            // Solo el líder puede cambiar el responsable
            const [rows] = await this.projectService.projectModel.db.execute(
                'SELECT user_id FROM projects WHERE id = ?', [projectId]
            );
            if (!rows.length || rows[0].user_id != userId) {
                return res.status(403).json({ message: "Solo el líder puede cambiar el responsable." });
            }

            await this.projectService.projectModel.db.execute(
                'UPDATE projects SET responsable = ? WHERE id = ?', [responsable, projectId]
            );

            res.json({ success: true, responsable });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar responsable." });
        }
    }

    async getProjectById(req, res) {
        try {
            const projectId = req.params.id;
            const [rows] = await this.projectService.projectModel.db.execute(
                'SELECT * FROM projects WHERE id = ?', [projectId]
            );
            if (!rows.length) {
                return res.status(404).json({ message: "Proyecto no encontrado" });
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ProjectController;