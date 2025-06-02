
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createConnection } from 'mysql2/promise';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306, // <-- asegúrate que sea el correcto
 connectTimeout: 20000 // 20 segundos


};

console.log('DB Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
});



async function connectWithRetry(config, retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await createConnection(config);
      return connection;
    } catch (err) {
      console.error(`Database connection failed (attempt ${i + 1}):`, err);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
}

connectWithRetry(dbConfig)
  .then(connection => {
    console.log('Database connected successfully');
    app.locals.db = connection;

    app.use('/api/projects', projectRoutes(connection));
    app.use('/api/users', userRoutes(connection));
    app.get('/health', (req, res) => {
      res.send('OK');
    });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
  })
  .catch(err => {
    console.error('Database connection failed after retries:', err);
    console.error('DB Config used:', dbConfig);
    process.exit(1);
  });

    