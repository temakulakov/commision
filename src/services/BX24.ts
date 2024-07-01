import { message } from 'antd';
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

export const renameFile = (file: File, newName: string): File => {
	return new File([file], newName, { type: file.type });
};

interface IFile {
	ID: string;
	NAME: string;
	DOWNLOAD_URL: string;
	// добавьте другие поля, которые вам нужны
}

export const getAllFiles = async (): Promise<IFile[]> => {
	let files: IFile[] = [];
	let start = 0;
	const step = 50;

	while (true) {
		try {
			const response = await axios.post(`${BASE_URL}disk.folder.getchildren`, {
				id: 4104,
				start,
				limit: step,
			});

			const result = response.data.result;

			if (Array.isArray(result) && result.length > 0) {
				files = [...files, ...result];
			} else {
				break;
			}

			if (result.length < step) {
				break;
			}

			start += step;
		} catch (error) {
			console.error('Error getting files:', error);
			throw error;
		}
	}

	console.log(files);
	return files;
};

export const getUploadUrl = async (roomId: string, fieldName: string) => {
	const PARENT_FOLDER_ID = 4104;

	try {
		const response = await axios.post(`${BASE_URL}disk.folder.uploadfile`, {
			// auth: API_TOKEN,
			id: PARENT_FOLDER_ID,
			data: {
				NAME: `${roomId}-${fieldName}`,
			},
		});

		return response.data.result.uploadUrl;
	} catch (error) {
		console.error('Error getting upload URL:', error);
		throw error;
	}
};

export const uploadFile = async (uploadUrl: string, file: File) => {
	const formData = new FormData();
	formData.append('file', file);

	try {
		await axios.post(uploadUrl, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	} catch (error) {
		console.error('Error uploading file:', error);
	}
	message.success('Файл успешно загружен');
};

export const deleteFile = async (fileId: string) => {
	try {
		const response = await axios.post(
			'https://intranet.gctm.ru/rest/1552/589nuaiewuwmtnb1/disk.file.delete',
			{
				id: fileId,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		return response.data;
	} catch (error) {
		throw new Error('Failed to delete file');
	}
};
