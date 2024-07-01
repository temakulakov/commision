export const Juravl = ['UF_CRM_1719568046'];
export const Nest = [
	'UF_CRM_1719568072',
	'UF_CRM_1719568104',
	'UF_CRM_1719568127',
	'UF_CRM_1719568145',
	'UF_CRM_1719568179',
	'UF_CRM_1719568198',
	'UF_CRM_1719568213',
];
export const Susl = ['UF_CRM_1719568232', 'UF_CRM_1719568249'];
export const Kos = [
	'UF_CRM_1719568266',
	'UF_CRM_1719568282',
	'UF_CRM_1719568304',
];
export const Gol = [
	'UF_CRM_1719568360',
	'UF_CRM_1719568377',
	'UF_CRM_1719568387',
	'UF_CRM_1719568405',
	'UF_CRM_1719568439',
	'UF_CRM_1719568490',
];
export const Plaks = ['UF_CRM_1719568508', 'UF_CRM_1719568528'];
export const Yakov = ['UF_CRM_1719568686'];

export interface UserField {
	ID: string;
	ENTITY_ID: string;
	FIELD_NAME: string;
	USER_TYPE_ID: string;
	XML_ID: any;
	SORT: string;
	MULTIPLE: string;
	MANDATORY: string;
	SHOW_FILTER: string;
	SHOW_IN_LIST: string;
	EDIT_IN_LIST: string;
	IS_SEARCHABLE: string;
	SETTINGS: Settings;
}

export interface Settings {
	DEFAULT_VALUE: number;
	DISPLAY: string;
	LABEL: string[];
	LABEL_CHECKBOX: string;
}

export interface Room {
	TITLE: string;
	ID: string;
	UF_CRM_1719568046: string | null;
	UF_CRM_1719568072: string | null;
	UF_CRM_1719568104: string | null;
	UF_CRM_1719568127: string | null;
	UF_CRM_1719568145: string | null;
	UF_CRM_1719568179: string | null;
	UF_CRM_1719568198: string | null;
	UF_CRM_1719568213: string | null;
	UF_CRM_1719568232: string | null;
	UF_CRM_1719568249: string | null;
	UF_CRM_1719568266: string | null;
	UF_CRM_1719568282: string | null;
	UF_CRM_1719568304: string | null;
	UF_CRM_1719568360: string | null;
	UF_CRM_1719568377: string | null;
	UF_CRM_1719568387: string | null;
	UF_CRM_1719568405: string | null;
	UF_CRM_1719568439: string | null;
	UF_CRM_1719568490: string | null;
	UF_CRM_1719568508: string | null;
	UF_CRM_1719568528: string | null;
	UF_CRM_1719568686: string | null;
}

export interface IUserField {
	id: string;
	value: string;
}

export interface ApiResponse<T> {
	result: T;
	total: number;
	time: {
		start: number;
		finish: number;
		duration: number;
		processing: number;
		date_start: string;
		date_finish: string;
	};
}
export interface IFile {
	id: string;
	name: string;
	// Другие поля файла...
}
