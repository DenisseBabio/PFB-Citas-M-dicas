import { Router } from 'express';
import { createConsultationController } from '../controllers/consultation/createConsultation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getConsultationDetailsController } from '../controllers/consultation/getconsultationbyid.js';
import { getConsultationController } from '../controllers/consultation/getConsultations.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { unassignedConsultationController } from '../controllers/consultation/unassignedConsultation.js';
import { assignConsultationController } from '../controllers/consultation/assignConsultation.js';

export const consultationRoutes = Router();

// Ruta para crear una consulta
consultationRoutes.post(
	'/consultations',
	authMiddleware,
	asyncHandler(createConsultationController)
);

// Ruta para obtener consultas sin atención
consultationRoutes.get(
	'/unassigned-consultation',
	authMiddleware,
	asyncHandler(unassignedConsultationController)
);

// Ruta para asignar un medico a una consulta
consultationRoutes.post(
	'/assign-consultation',
	authMiddleware,
	asyncHandler(assignConsultationController)
);

// Ruta para obtener todas las consultas
consultationRoutes.get(
	'/consultations',
	authMiddleware,
	asyncHandler(getConsultationController)
);

// Ruta para obtener los datos de una consulta
consultationRoutes.get(
	'/consultations/:id/details',
	authMiddleware,
	asyncHandler(getConsultationDetailsController)
);
