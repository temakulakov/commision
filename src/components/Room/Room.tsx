import { Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import React, { useState } from 'react';
import { Room as IRoom, IUserField } from '../../types'; // Подключите типы
import styles from './Room.module.scss';

interface Props {
	room: IRoom;
	userFields: IUserField[];
	user: number;
}

const users = [1462, 1725, 1873, 1741, 1669, 1460, 2047];

const Juravl = ['UF_CRM_1719568046'];
const Nest = [
	'UF_CRM_1719568072',
	'UF_CRM_1719568104',
	'UF_CRM_1719568127',
	'UF_CRM_1719568145',
	'UF_CRM_1719568179',
	'UF_CRM_1719568198',
	'UF_CRM_1719568213',
];
const Susl = ['UF_CRM_1719568232', 'UF_CRM_1719568249'];
const Kos = ['UF_CRM_1719568266', 'UF_CRM_1719568282', 'UF_CRM_1719568304'];
const Gol = [
	'UF_CRM_1719568360',
	'UF_CRM_1719568377',
	'UF_CRM_1719568387',
	'UF_CRM_1719568405',
	'UF_CRM_1719568439',
	'UF_CRM_1719568490',
];
const Plaks = ['UF_CRM_1719568508', 'UF_CRM_1719568528'];
const Yakov = ['UF_CRM_1719568686'];

export const Room = ({ room, userFields, user }: Props) => {
	const success = () => {
		Modal.success({
			content: 'Изменения сохранились',
		});
	};

	const [fieldValues, setFieldValues] = useState<Partial<IRoom>>({
		UF_CRM_1719568046: room.UF_CRM_1719568046,
		UF_CRM_1719568072: room.UF_CRM_1719568072,
		UF_CRM_1719568104: room.UF_CRM_1719568104,
		UF_CRM_1719568127: room.UF_CRM_1719568127,
		UF_CRM_1719568145: room.UF_CRM_1719568145,
		UF_CRM_1719568179: room.UF_CRM_1719568179,
		UF_CRM_1719568198: room.UF_CRM_1719568198,
		UF_CRM_1719568213: room.UF_CRM_1719568213,
		UF_CRM_1719568232: room.UF_CRM_1719568232,
		UF_CRM_1719568249: room.UF_CRM_1719568249,
		UF_CRM_1719568266: room.UF_CRM_1719568266,
		UF_CRM_1719568282: room.UF_CRM_1719568282,
		UF_CRM_1719568304: room.UF_CRM_1719568304,
		UF_CRM_1719568360: room.UF_CRM_1719568360,
		UF_CRM_1719568377: room.UF_CRM_1719568377,
		UF_CRM_1719568387: room.UF_CRM_1719568387,
		UF_CRM_1719568405: room.UF_CRM_1719568405,
		UF_CRM_1719568439: room.UF_CRM_1719568439,
		UF_CRM_1719568490: room.UF_CRM_1719568490,
		UF_CRM_1719568508: room.UF_CRM_1719568508,
		UF_CRM_1719568528: room.UF_CRM_1719568528,
		UF_CRM_1719568686: room.UF_CRM_1719568686,
	});

	const handleChange =
		(key: keyof IRoom) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setFieldValues({
				...fieldValues,
				[key]: e.target.value,
			});
		};

	const handleSave = async (key: keyof IRoom) => {
		let userFieldsToSave: Partial<IRoom> = {};

		// Определяем доступные для пользователя поля
		const accessibleFields = (() => {
			switch (user) {
				case 1462:
					return Juravl;
				case 1752:
					return Nest;
				case 1873:
					return Susl;
				case 1741:
					return Kos;
				case 1669:
					return Gol;
				case 1460:
					return Plaks;
				case 2047:
					return Yakov;
				default:
					return [];
			}
		})();

		// Заполняем значения полей для сохранения
		if (accessibleFields.includes(key as string)) {
			const value = fieldValues[key];
			if (value !== null && value !== undefined) {
				userFieldsToSave[key] = value as string;
			}
		}

		console.log('Сохраненные значения:', userFieldsToSave);

		// Формируем объект для отправки
		const payload = {
			id: room.ID,
			fields: userFieldsToSave,
		};

		try {
			// Отправляем POST-запрос с помощью axios
			const response = await axios.post(
				'https://intranet.gctm.ru/rest/1552/589nuaiewuwmtnb1/crm.deal.update',
				payload,
				{
					headers: {
						'Content-Type': 'application/json', // Устанавливаем тип контента
					},
				}
			);
			// .then(() => success());

			// Выводим ответ от сервера в консоль
			// console.log('Ответ от сервера:', response.);
		} catch (error) {
			console.error('Ошибка при отправке запроса:', error);
		}
	};

	return (
		<div className={styles.root}>
			<h2>Комната номер: {room.TITLE}</h2>
			{user === 1462 && (
				<>
					<p>
						{
							'Журавлева В.Л. - помещений фондохранилищ, фондового оборудования и витрин'
						}
					</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568046 || ''}
						onChange={handleChange('UF_CRM_1719568046')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568046')}
					/>
				</>
			)}
			{user === 1752 && (
				<>
					<p>{'Нестеров А.А. - систем пожарной и охранной сигнализации'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568072 || ''}
						onChange={handleChange('UF_CRM_1719568072')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568072')}
					/>
					<p>{'Нестеров А.А. - системы охранного телевидения'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568104 || ''}
						onChange={handleChange('UF_CRM_1719568104')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568104')}
					/>
					<p>{'Нестеров А.А. - системы оповещения и управления эвакуацией'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568127 || ''}
						onChange={handleChange('UF_CRM_1719568127')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568127')}
					/>
					<p>{'Нестеров А.А - системы контроля и управления доступом'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568145 || ''}
						onChange={handleChange('UF_CRM_1719568145')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568145')}
					/>
					<p>
						{'Нестеров А.А. - систем пожаротушения и противодымной вентиляции'}
					</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568179 || ''}
						onChange={handleChange('UF_CRM_1719568179')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568179')}
					/>
					<p>{'Нестеров А.А. - системы видеонаблюдения'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568198 || ''}
						onChange={handleChange('UF_CRM_1719568198')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568198')}
					/>
					<p>{'Нестеров А.А. - автоматизации'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568213 || ''}
						onChange={handleChange('UF_CRM_1719568213')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568213')}
					/>
				</>
			)}
			{user === 1873 && (
				<>
					<p>{'Суслова О.А. - общеобменной вентиляции'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568232 || ''}
						onChange={handleChange('UF_CRM_1719568232')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568232')}
					/>
					<p>{'Суслова О.А. - аварийной вентиляции'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568249 || ''}
						onChange={handleChange('UF_CRM_1719568249')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568249')}
					/>
				</>
			)}
			{user === 1741 && (
				<>
					<p>{'Косырев И.Ю. - электрооборудования'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568266 || ''}
						onChange={handleChange('UF_CRM_1719568266')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568266')}
					/>
					<p>{'Косырев И.Ю. - электроустановок'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568282 || ''}
						onChange={handleChange('UF_CRM_1719568282')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568282')}
					/>
					<p>{'Косырев И.Ю. - электроосвещения'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568304 || ''}
						onChange={handleChange('UF_CRM_1719568304')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568304')}
					/>
				</>
			)}
			{user === 1669 && (
				<>
					<p>{'Головко В.М. - ИТП'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568360 || ''}
						onChange={handleChange('UF_CRM_1719568360')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568360')}
					/>
					<p>{'Головко В.М. - системы холодоснабжения'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568377 || ''}
						onChange={handleChange('UF_CRM_1719568377')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568377')}
					/>
					<p>{'Головко В.М. - холодильные машины'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568387 || ''}
						onChange={handleChange('UF_CRM_1719568387')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568387')}
					/>
					<p>{'Головко В.М. - системы кондиционирования'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568405 || ''}
						onChange={handleChange('UF_CRM_1719568405')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568405')}
					/>
					<p>{'Головко В.М. - системы водоснабжения и канализации'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568439 || ''}
						onChange={handleChange('UF_CRM_1719568439')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568439')}
					/>
					<p>{'Головко В.М. - системы отопления'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568490 || ''}
						onChange={handleChange('UF_CRM_1719568490')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568490')}
					/>
				</>
			)}
			{user === 1460 && (
				<>
					<p>{'Плаксун В.В. - систем диспетчеризации'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568508 || ''}
						onChange={handleChange('UF_CRM_1719568508')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568508')}
					/>
					<p>{'Плаксун В.В. - структурированные кабельные системы'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568528 || ''}
						onChange={handleChange('UF_CRM_1719568528')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568528')}
					/>
				</>
			)}
			{user === 2047 && (
				<>
					<p>{'Яковлева Н.Н. - конструктив и архитектура'}</p>
					<TextArea
						value={fieldValues.UF_CRM_1719568686 || ''}
						onChange={handleChange('UF_CRM_1719568686')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568686')}
					/>
				</>
			)}
			{/* Кнопка для сохранения всех полей */}
			{/* <Button onClick={handleSave}>Сохранить</Button> */}
		</div>
	);
};
