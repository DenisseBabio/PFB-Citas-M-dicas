import { faker } from '@faker-js/faker';
import { Db } from '../structure/db.js';
import { hashPassword } from '../../utils/hashPassword.js';
import { infoLog, succesLog } from '../../utils/logger.js';

// Insertar datos falsos a la tabla specialities
const specialities = [
	{ id: 1, name: 'Cardiología' },
	{ id: 2, name: 'Dermatología' },
	{ id: 3, name: 'Endocrinología' },
	{ id: 4, name: 'Gastroenterología' },
	{ id: 5, name: 'Geriatría' },
	{ id: 6, name: 'Ginecología' },
	{ id: 7, name: 'Hematología' },
	{ id: 8, name: 'Infectología' },
	{ id: 9, name: 'Medicina interna' },
	{ id: 10, name: 'Nefrología' },
	{ id: 11, name: 'Neumología' },
	{ id: 12, name: 'Neurología' },
	{ id: 13, name: 'Oftalmología' },
	{ id: 14, name: 'Oncología' },
	{ id: 15, name: 'Pediatría' },
	{ id: 16, name: 'Psiquiatría' },
	{ id: 17, name: 'Reumatología' },
	{ id: 18, name: 'Traumatología' },
	{ id: 19, name: 'Urología' },
	{ id: 20, name: 'Otorrinolaringología' },
];

async function createSpecialities() {
	for (let i = 0; i < specialities.length; i++) {
		await Db.query(
			'INSERT INTO specialities (name) VALUES (:name)',
			specialities[i]
		);
	}
}

infoLog('Insertando datos de specialities...');

await createSpecialities();

succesLog('Datos specilities insertados correctamente');

// Insertar datos falsos a la tabla users
const [getSpecialities] = await Db.query('SELECT id FROM specialities');
const specialityIds = getSpecialities.map((speciality) => speciality.id);

const demoUserCount = 100;
const globalPassword = 'pass1234';

async function createDemoUsers() {
	// Crear pacientes
	for (let i = 0; i < demoUserCount / 2; i++) {
		const username = faker.internet.userName();
		const user = {
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			email: faker.internet.email(),
			password: await hashPassword(globalPassword),
			userType: 'patient',
			userName: username,
			biography: null,
			avatar: `https://i.pravatar.cc/150?u=${username}`,
		};

		await Db.query(
			'INSERT INTO users (firstName, lastName, email, password, userType, userName, biography, avatar) VALUES (:firstName, :lastName, :email, :password, :userType, :userName, :biography, :avatar)',
			user
		);
	}

	// Crear doctores
	for (let i = 0; i < demoUserCount / 2; i++) {
		const username = faker.internet.userName();
		const user = {
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			email: faker.internet.email(),
			password: await hashPassword(globalPassword),
			userType: 'doctor',
			userName: username,
			codigoMedico: 123456789,
			biography: faker.lorem.paragraph(),
			avatar: `https://i.pravatar.cc/150?u=${username}`,
			experience: faker.number.int({ min: 1, max: 10 }),
		};

		const [result] = await Db.query(
			'INSERT INTO users (firstName, lastName, email, password, userType, userName, biography, codigoMedico, avatar, experience) VALUES (:firstName, :lastName, :email, :password, :userType, :userName, :biography, :codigoMedico, :avatar, :experience)',
			user
		);

		const doctorId = result.insertId;
		const numSpecialities = faker.number.int({ min: 1, max: 3 });
		const assignedSpecialities = faker.helpers.arrayElements(
			specialityIds,
			numSpecialities
		);

		for (const specialityId of assignedSpecialities) {
			await Db.query(
				'INSERT INTO user_specialities (userId, specialityId) VALUES (:userId, :specialityId)',
				{ userId: doctorId, specialityId }
			);
		}
	}
}

infoLog('Insertando datos de users...');

await createDemoUsers();

succesLog('Datos users insertados correctamente');

// Insertar datos falsos a la tabla consultations
const getDoctors = await Db.query(
	"SELECT id FROM users WHERE userType = 'doctor'"
);
const getDoctorsIds = getDoctors[0].map((doctor) => doctor.id);

const getPatients = await Db.query(
	"SELECT id FROM users WHERE userType = 'patient'"
);
const getPatientsIds = getPatients[0].map((patient) => patient.id);

function getRandomFutureDate() {
	const now = new Date();
	const futureDate = faker.date.future({ refDate: now });

	// Establecer la hora entre 9 AM y 2 PM
	const hour = faker.number.int({ min: 11, max: 14 });
	futureDate.setHours(hour);

	// Establecer los minutos en intervalos de 30 minutos
	const minutes = faker.helpers.arrayElement([0, 30]);
	futureDate.setMinutes(minutes);

	// Establecer los segundos y milisegundos a 0
	futureDate.setSeconds(0);
	futureDate.setMilliseconds(0);

	return futureDate;
}

async function createConsultations() {
	for (let i = 0; i < 200; i++) {
		const consultations = {
			title: faker.lorem.words(),
			date: getRandomFutureDate(),
			description: faker.lorem.paragraph(),
			severity: faker.helpers.arrayElement(['high', 'medium', 'low']),
			patientId: faker.helpers.arrayElement(getPatientsIds),
			doctorId: faker.helpers.arrayElement(getDoctorsIds),
			specialityId: faker.helpers.arrayElement(specialityIds),
			status: faker.helpers.arrayElement(['pending', 'completed']),
		};

		await Db.query(
			'INSERT INTO consultations (title, date, description, severity, patientId, doctorId, specialityId, status) VALUES (:title, :date, :description, :severity, :patientId, :doctorId, :specialityId, :status)',
			consultations
		);
	}
}
infoLog('Insertando datos de consultations...');

await createConsultations();

succesLog('Datos consultations insertados correctamente');

// Insertar datos falsos a la tabla responses
const getConsultations = await Db.query('SELECT id FROM consultations');
const getConsultationsIds = getConsultations[0].map(
	(consultation) => consultation.id
);

async function createResponses() {
	for (let i = 0; i < 100; i++) {
		const responses = {
			content: faker.lorem.paragraph(),
			consultationId: faker.helpers.arrayElement(getConsultationsIds),
			rating: faker.helpers.arrayElement([null, 0, 1, 2, 3, 4, 5]),
		};

		await Db.query(
			'INSERT INTO responses (content, consultationId, rating) VALUES (:content, :consultationId, :rating)',
			responses
		);
	}
}

infoLog('Insertando datos de responses...');

await createResponses();

succesLog('Datos responses insertados correctamente');

// Insertar datos falsos a la tabla files_consultations

async function createFilesConsultations() {
	for (let i = 0; i < 200; i++) {
		const username = faker.internet.userName();
		const filesConsultations = {
			consultationId: faker.helpers.arrayElement(getConsultationsIds),
			fileName: faker.system.fileName(),
			filePath: faker.helpers.arrayElement([
				`${faker.system.commonFileName('pdf')}`,
				`${faker.system.commonFileName('txt')}`,
				`${faker.system.commonFileName('docx')}`,
				`/public/defaultFile.webp`,
			]),
		};

		await Db.query(
			'INSERT INTO files_consultations (consultationId, fileName, filePath) VALUES (:consultationId, :fileName, :filePath)',
			filesConsultations
		);
	}
}
infoLog('Insertando datos de files_consultations...');

await createFilesConsultations();

succesLog('Datos files_consultations insertados correctamente');

// Insertar datos falsos a la tabla files_responses

const getResponses = await Db.query('SELECT id FROM responses');
const getResponsesIds = getResponses[0].map((response) => response.id);

async function createFilesResponses() {
	for (let i = 0; i < 200; i++) {
		const username = faker.internet.userName();
		const filesResponses = {
			responseId: faker.helpers.arrayElement(getResponsesIds),
			fileName: faker.system.fileName(),
			filePath: faker.helpers.arrayElement([
				`${faker.system.commonFileName(`pdf`)}`,
				`${faker.system.commonFileName(`txt`)}`,
				`${faker.system.commonFileName(`docx`)}`,
				`/public/defaultFile.webp`,
			]),
		};

		await Db.query(
			'INSERT INTO files_responses (responseId, fileName, filePath) VALUES (:responseId, :fileName, :filePath)',
			filesResponses
		);
	}
}
infoLog('Insertando datos de files_responses...');

await createFilesResponses();

succesLog('Datos files_responses insertados correctamente');

infoLog('¡Todos los datos insertados exitosamente!');
await Db.end();
