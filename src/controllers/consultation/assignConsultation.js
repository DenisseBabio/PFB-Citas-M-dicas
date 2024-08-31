import { setDoctorId } from '../../database/consultation.js';
import { parseAssignDoctorPayload } from '../../validations/consultations.js';

// Controlador para asignar una consulta

export const assignConsultationController = async (req, res) => {
	const doctor = req.currentUser;
	const doctorId = doctor.id;
	const { consultationId } = parseAssignDoctorPayload(req.body);

	if (doctor.userType === 'doctor') {
		const setDoctor = await setDoctorId(doctorId, consultationId);

		if (doctor.userType != 'doctor') {
			throw generateErrors(403, 'UNAUTHORIZED', 'Acceso no autorizado');
		}

		if (!setDoctor) {
			throw generateErrors(400, 'DOCTOR_NOT_FOUND', 'Médico no encontrado');
		}

		res.status(200).json({ message: 'Consulta asignada' });
	}
};
