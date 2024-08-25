import nodemailer from 'nodemailer';
import {
	EMAIL_HOST,
	EMAIL_PASS,
	EMAIL_PORT,
	EMAIL_USER,
} from '../../constants.js';

// Configuración del transporte de nodemailer

export const transport = nodemailer.createTransport({
	host: EMAIL_HOST,
	port: EMAIL_PORT,
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASS,
	},
});
