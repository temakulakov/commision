import axios from 'axios';
import {
	ApiResponse,
	Gol,
	IUserField,
	Juravl,
	Kos,
	Nest,
	Plaks,
	Room,
	Susl,
	UserField,
	Yakov,
} from '../types'; // Подключите типы Juravl

const BASE_URL = 'https://intranet.gctm.ru/rest/1552/589nuaiewuwmtnb1/';

export const fetchRooms = async (level?: string) => {
	const response = await axios.post<ApiResponse<Room[]>>(
		BASE_URL + 'crm.deal.list',
		{
			filter: {
				STAGE_ID: level,
				CATEGORY_ID: 15,
			},
			order: {
				TITLE: 'ASC',
			},
			select: [
				...Juravl,
				...Nest,
				...Susl,
				...Kos,
				...Gol,
				...Plaks,
				...Yakov,
				'TITLE',
			],
		}
	);
	return response.data.result;
};

export const fetchCurrentRoom = async (title: string, level: string) => {
	const response = await axios.post<ApiResponse<Room>>(
		BASE_URL + 'crm.deal.list',
		{
			filter: {
				STAGE_ID: level,
				CATEGORY_ID: 15, // Убедитесь, что CATEGORY_ID указан как число, не строка
				TITLE: title,
			},
			select: [...Juravl, 'TITLE'],
		}
	);
	return response.data.result;
};

interface Pro {
	ENTITY_ID: string;
	SETTINGS: { LABEL_CHECKBOX: string };
	FIELD_NAME: string;
}

interface ResultFields {
	id: string;
	value: string;
}

export const fetchUserFields = async (): Promise<IUserField[]> => {
	const response = await axios.post<ApiResponse<UserField[]>>(
		BASE_URL + 'crm.deal.userfield.list',
		{
			filter: {
				ENTITY_ID: 'CRM_DEAL',
			},
		}
	);

	// Преобразуем данные в нужный формат
	return response.data.result.map(item => ({
		id: item.FIELD_NAME,
		value: item.SETTINGS.LABEL_CHECKBOX,
	}));
};
