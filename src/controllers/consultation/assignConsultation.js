import { assignDoctorToConsultation } from '../../database/consultation.js';

export const assignConsultationController = async (req, res) => {
	const doctor = req.currentUser;
	const doctorid = doctor.id;
	const { consultationId } = req.body;

	if (doctor.userType === 'doctor') {
		const setDoctor = await assignDoctorToConsultation(
			doctorid,
			consultationId
		);

		if (doctor.userType != 'doctor') {
			throw generateErrors(403, 'UNAUTHORIZED', 'Acceso no autorizado');
		}

		if (!setDoctor) {
			throw generateErrors(400, 'DOCTOR_NOT_FOUND', 'Médico no encontrado');
		}

		res.status(200).json({ message: 'Consulta asignada' });
	}
};
