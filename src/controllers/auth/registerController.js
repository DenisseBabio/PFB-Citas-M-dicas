import crypto from 'node:crypto';
import { CODIGO_MEDICO } from '../../../constants.js';
import {
	assertEmailNotInUse,
	assertUsernameNotInUse,
	assignSpecialitiesToUser,
	createUser,
} from '../../database/users.js';
import { sendValidationEmail } from '../../emails/validationEmail.js';
import { hashPassword } from '../../utils/hashPassword.js';
import { parseRegisterPayload } from '../../validations/auth.js';

export const registerController = async (req, res) => {
	const {
		firstName,
		lastName,
		userType,
		biography,
		codigoMedico,
		experience,
		email,
		password,
		userName,
	} = parseRegisterPayload(req.body);
	const specialityId = req.body.specialityId;

	if (userType === 'doctor' && !codigoMedico) {
		return res
			.status(400)
			.json({ message: 'El código médico es obligatorio para los doctores' });
	}

	if (codigoMedico != CODIGO_MEDICO) {
		return res.status(400).json({ message: 'El código médico no es correcto' });
	}

	await assertEmailNotInUse(email);
	await assertUsernameNotInUse(userName);

	const hashedPassword = await hashPassword(password);
	const validationCode = crypto.randomInt(100000, 999999);

	const id = await createUser({
		firstName,
		lastName,
		userType,
		biography,
		codigoMedico,
		experience,
		email,
		hashedPassword,
		userName,
		validationCode,
	});

	await assignSpecialitiesToUser(id, specialityId);

	sendValidationEmail({ firstName, email, validationCode });

	res.status(201).json({
		id,
	});
};
