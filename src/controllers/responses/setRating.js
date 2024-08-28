// controlador para insertar un rating a una respuesta

import { getResponseById, setRating } from '../../database/responses.js';
import { parseRatingPayload } from '../../validations/responses.js';

export const setRatingController = async (req, res) => {
	const { id } = req.params;
	const { rating } = parseRatingPayload(req.body);
	const userId = req.currentUser.id;
	const response = await getResponseById(id);

	if (!response) {
		return res.status(404).json({ message: 'respuesta no encontrada' });
	}

	if (response.rating) {
		return res
			.status(400)
			.json({ message: 'la respuesta ya ha sido valorada' });
	}

	if (userId === response.doctorId) {
		return res
			.status(400)
			.json({ message: 'Los dostores no pueden valorar las consultas' });
	}

	await setRating(id, rating);
	res.status(200).json({ message: 'Rating updated successfully' });
};
