'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { dbConnection as dbMongoConnection } from './dbMongo.js';

// Ensure models are registered before DB sync

import '../src/users/user.model.js';

import { requestLimit } from '../middlewares/request-limit.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import {
  errorHandler,
  notFound,
} from '../middlewares/server-genericError-handler.js';

import authRoutes from '../src/auth/auth.routes.js';
import postRoutes from '../src/posts/post.routes.js';
import commentRoutes from '../src/comment/comment.routes.js';

const BASE_PATH = '/api/v1';

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cors(corsOptions));
  app.use(helmet(helmetConfiguration));
  app.use(requestLimit);
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = (app) => {
  app.use(`${BASE_PATH}/auth`, authRoutes);
  app.use(`${BASE_PATH}/posts`, postRoutes);
  app.use(`${BASE_PATH}/comments`, commentRoutes);

  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'Proyecto Gestor de Opiniones Authentication Service',
    });
  });
  // 404 handler (standardized)
  app.use(notFound);
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT;
  app.set('trust proxy', 1);

  try {
    // Conectar PostgreSQL
    await dbConnection();
    console.log('✅ PostgreSQL connected successfully');

    // Conectar MongoDB
    await dbMongoConnection();
    console.log('✅ MongoDB connected successfully');

    middlewares(app);  // <- agrega esta línea
    routes(app);       // <- agrega esta línea

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Proyecto Gestor de Opiniones Auth Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
    });
  } catch (err) {
    console.error(
      `Error starting Proyecto Gestor de opiniones Auth Server: ${err.message}`
    );
    process.exit(1);
  }
};
