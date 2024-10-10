import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import {
	notFoundController,
	errorController,
} from './src/controllers/errors/index.js';
import { corsOptions, PORT } from './constants.js';
import { infoLog } from './src/utils/logger.js';
import { consultationRoutes } from './src/routes/consultation.js';
import { authRoutes } from './src/routes/auth.js';
import { specilitiesRoutes } from './src/routes/specialities.js';
import { usersRoutes } from './src/routes/users.js';
import { responsesRoutes } from './src/routes/responses.js';
import { availabilityRoutes } from './src/routes/availability.js';
import path from 'path';

const app = express();


// Middleware para parsear el body de las peticiones

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware cors

app.use(cors(corsOptions));

// Middleware para morgan

app.use(morgan('dev'));

// Middleware para subir ficheros

app.use(fileUpload());

// Establecemos el directorio público

app.use(express.static(path.join(process.cwd(), 'public')));

// Rutas

app.use(authRoutes);

app.use(consultationRoutes);

app.use(responsesRoutes);

app.use(specilitiesRoutes);

app.use(usersRoutes);

app.use(availabilityRoutes);

// Middleware de Ruta no encontrada

app.use(notFoundController);

// Middleware gestión de errores

app.use(errorController);

// Inicializamos el servidor
app.listen(PORT || 3000, () => {
	infoLog(`Server is running on port ${PORT}`);
});
