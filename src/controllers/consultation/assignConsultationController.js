import { setDoctorIdInConsultation } from '../../database/services/consultations/setDoctorIdInConsultation.js';
import { generateErrors } from '../../utils/generateErrors.js';
import { parseAssignDoctorPayload } from '../../validations/consultations/parseAssignDoctorPayload.js';

// Controlador para asignar una consulta

export const assignConsultationController = async (req, res) => {
	const doctor = req.currentUser;
	const doctorId = doctor.id;
	const { consultationId } = parseAssignDoctorPayload(req.body);

	const setDoctor = await setDoctorIdInConsultation(doctorId, consultationId);

	if (!setDoctor) {
		throw generateErrors(400, 'DOCTOR_NOT_FOUND', 'Médico no encontrado');
	}

	res.status(200).json({ message: 'Consulta asignada' });
};
