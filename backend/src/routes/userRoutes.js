import express from 'express';

export default function userRoutes(db) {
  const router = express.Router();

  // Registrar usuario si no existe (llamado tras login con Cognito)
  router.post('/register', async (req, res) => {
    const { email } = req.body;
    console.log("Intentando registrar:", email);
    try {
      const [rows] = await db.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      if (rows.length === 0) {
        // Usa el email como username y un password dummy
        await db.query(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [email, email, 'cognito']
        );
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: 'Error al registrar usuario' });
    }
  });

  // GET display_name
  router.get('/:email/display-name', async (req, res) => {
    const { email } = req.params;
    try {
      const [rows] = await db.query(
        'SELECT display_name FROM users WHERE email = ?',
        [email]
      );
      if (rows.length > 0) {
        res.json({ display_name: rows[0].display_name });
      } else {
        res.json({ display_name: null });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error al consultar display_name' });
    }
  });

    router.get('/:email/id', async (req, res) => {
    const { email } = req.params;
    try {
      const [rows] = await db.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      if (rows.length > 0) {
        res.json({ user_id: rows[0].id });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error al consultar user_id' });
    }
  });


  // POST display_name (crea el usuario si no existe)
  router.post('/:email/display-name', async (req, res) => {
    const { email } = req.params;
    const { display_name } = req.body;
    try {
      const [result] = await db.query(
        'UPDATE users SET display_name = ? WHERE email = ?',
        [display_name, email]
      );
      if (result.affectedRows === 0) {
        // Usa el email como username y un password dummy
        await db.query(
          'INSERT INTO users (username, email, password, display_name) VALUES (?, ?, ?, ?)',
          [email, email, 'cognito', display_name]
        );
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: 'Error al guardar display_name' });
    }
  });

  router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const [rows] = await db.query(
      'SELECT email, display_name FROM users WHERE email LIKE ? LIMIT 10',
      [`${q}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar usuarios' });
  }
});

  return router;
}
