import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { fetchRooms } from '../../services/BX24';
import { Room as IRoom } from '../../types';
import { Level } from '../Level/Level';
import styles from './Report.module.scss';

const StagesID = [
	'',
	'C15:NEW',
	'C15:PREPARATION',
	'C15:PREPAYMENT_INVOIC',
	'C15:EXECUTING',
];

// Словарь для сопоставления ключей полей с названиями на русском языке
const fieldNames: { [key: string]: string } = {
	TITLE: 'Название',
	ID: 'Идентификатор',
	UF_CRM_1719568046:
		'Журавлева В.Л. - помещений фондохранилищ, фондового оборудования и витрин',
	UF_CRM_1719568072: 'Нестеров А.А. - систем пожарной и охранной сигнализации',
	UF_CRM_1719568104: 'Нестеров А.А. - системы охранного телевидения',
	UF_CRM_1719568127:
		'Нестеров А.А. - системы оповещения и управления эвакуацией',
	UF_CRM_1719568145: 'Нестеров А.А - системы контроля и управления доступом',
	UF_CRM_1719568179:
		'Нестеров А.А. - систем пожаротушения и противодымной вентиляции',
	UF_CRM_1719568198: 'Нестеров А.А. - систем радиофикации и электрочасофикации',
	UF_CRM_1719568213: 'Нестеров А.А. - рентгенотелевизионной установки',
	UF_CRM_1719568232: 'Суслова О.А. - системы билетно-кассового обслуживания',
	UF_CRM_1719568249:
		'Суслова О.А. - оборудования для демонстрации печатной и иной продукции',
	UF_CRM_1719568266:
		'Косырев И.Ю. - инженерных систем Объекта, включая ИТП, лифтовое оборудование, молниезащиту и заземление, наружное освещение',
	UF_CRM_1719568282:
		'Косырев И.Ю. - комплексной автоматизации и диспетчеризации инженерных систем',
	UF_CRM_1719568304: 'Косырев И.Ю. - охранно-защитной дератизационной системы',
	UF_CRM_1719568360:
		'Головко В.М. - серверного и компьютерного оборудования, оргтехники',
	UF_CRM_1719568377: 'Головко В.М. - системы телефонизации',
	UF_CRM_1719568387: 'Головко В.М. - системы связи МГН',
	UF_CRM_1719568405: 'Головко В.М. - системы кабельного телевидения',
	UF_CRM_1719568439: 'Головко В.М. - структурированной кабельной сети',
	UF_CRM_1719568490: 'Головко В.М. - локальной вычислительной сети',
	UF_CRM_1719568508:
		'Плаксун В.В. - мебели, дверных замков, оборудования кафе, оборудования административных помещений, хозинвентаря',
	UF_CRM_1719568528: 'Плаксун В.В. - устройства площадки накопления ТБО.',
	UF_CRM_1719568686:
		'Яковлева Н.Н. - благоустройства и ландшафтного оформления территории.',
};

export const Report = () => {
	const [level, setLevel] = useState<number>(0);

	const handleChangeLevel = (id: number) => {
		setLevel(id);
	};

	const {
		data: rooms,
		isLoading: isLoadingRooms,
		error: errorRooms,
	} = useQuery<IRoom[]>({
		queryKey: ['rooms-report', StagesID[level]],
		queryFn: () => fetchRooms(StagesID[level]),
	});

	const columns = [
		{
			title: 'Поле',
			dataIndex: 'field',
			key: 'field',
			width: 250,
		},
		{
			title: 'Значение',
			dataIndex: 'value',
			key: 'value',
		},
	];

	return (
		<div className={styles.root}>
			<Level level={level} handleChange={handleChangeLevel} />
			{isLoadingRooms && <div>Загрузка комнат...</div>}
			{errorRooms && (
				<div>Ошибка при загрузке комнат: {errorRooms.message}</div>
			)}
			<AnimatePresence>
				{rooms &&
					rooms.map(room => {
						const dataSource = Object.keys(room).map(key => ({
							key,
							field: fieldNames[key] || key,
							value: room[key as keyof IRoom] ?? 'N/A',
						}));
						return (
							<motion.div
								key={room.ID}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								transition={{ duration: 0.5 }}
								className={styles.room}
							>
								<Table
									columns={columns}
									dataSource={dataSource}
									pagination={false}
									bordered
									title={() => `Помещение ${room.TITLE}`}
								/>
							</motion.div>
						);
					})}
			</AnimatePresence>
		</div>
	);
};
