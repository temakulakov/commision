import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, UploadFile, UploadProps, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
	deleteFile,
	getAllFiles,
	getUploadUrl,
	renameFile,
	uploadFile,
} from '../../services/BX24';
import { Room as IRoom } from '../../types';
import styles from './Room.module.scss';

interface UploadRequestOption<T = any> {
	file: File;
	onSuccess?: (response: T, file: File) => void;
	onError?: (error: any, response?: T) => void;
}

interface RcCustomRequestOptions {
	file: File;
	onSuccess?: (response: any, file: File) => void;
	onError?: (err: Error, response: any) => void;
	onProgress?: (event: { percent: number }, file: File) => void;
}

interface Props {
	room: IRoom;
	user: number;
}

interface IFile {
	ID: string;
	NAME: string;
	DOWNLOAD_URL: string;
}

const getBase64 = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = error => reject(error);
	});

const uploadButton = (
	<div onClick={() => {}}>
		<PlusOutlined />
		<div style={{ marginTop: 8 }}>Upload</div>
	</div>
);

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

export const Room = ({ room, user }: Props) => {
	const [fieldValues, setFieldValues] = useState<Partial<IRoom>>({});
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	// Загружаем файлы при монтировании компонента
	useEffect(() => {
		const loadFiles = async () => {
			try {
				const files = await getAllFiles();
				setFileList(
					files.map(file => ({
						uid: file.ID,
						name: file.NAME,
						status: 'done',
						url: file.DOWNLOAD_URL,
					}))
				);
			} catch (error) {
				message.error('Ошибка при загрузке файлов');
			}
		};

		loadFiles();
	}, []);

	useEffect(() => {
		// Инициализация значений полей
		setFieldValues({
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
	}, [room]);

	const handleChange =
		(key: keyof IRoom) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setFieldValues({
				...fieldValues,
				[key]: e.target.value,
			});
		};

	const handleSave = async (key: keyof IRoom) => {
		let userFieldsToSave: Partial<IRoom> = {};

		const accessibleFields = (() => {
			switch (user) {
				case 1462:
					return Juravl;
				case 1725:
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

		if (accessibleFields.includes(key as string)) {
			const value = fieldValues[key];
			if (value !== null && value !== undefined) {
				userFieldsToSave[key] = value as string;
			}
		}

		const payload = {
			id: room.ID,
			fields: userFieldsToSave,
		};

		try {
			await axios.post(
				'https://intranet.gctm.ru/rest/1552/589nuaiewuwmtnb1/crm.deal.update',
				payload,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			message.success('Изменения успешно сохранены');
		} catch (error) {
			message.error('Ошибка при сохранении изменений');
			console.error('Ошибка при отправке запроса:', error);
		}
	};

	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as File);
		}

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	const handleRemove = async (file: UploadFile) => {
		try {
			await deleteFile(file.uid);
			const newFileList = fileList.filter(item => item.uid !== file.uid);
			setFileList(newFileList);
			message.success(`Файл ${file.name} успешно удален`);
		} catch (error) {
			message.error('Не удалось удалить файл');
		}
	};

	const handleChangeFile: UploadProps['onChange'] = ({
		fileList: newFileList,
	}) => setFileList(newFileList);

	const handleUpload = async (options: UploadRequestOption<any>) => {
		const { file, onSuccess, onError } = options;

		try {
			const uploadUrl = await getUploadUrl(room.ID, 'fieldName'); // Замените 'fieldName' на фактическое имя поля, если требуется
			const formData = new FormData();
			formData.append('file', file);

			const response = await uploadFile(uploadUrl, file);
			if (onSuccess) {
				// onSuccess(response.data, file);
			}
			message.success(`Файл ${file.name} успешно загружен`);
		} catch (error) {
			if (onError) {
				onError(error);
			}
			message.error('Ошибка при загрузке файла');
		}
	};

	return (
		<div className={styles.room}>
			<h2 className={styles.title}>{room.TITLE}</h2>
			<div className={styles.fields}>
				{Object.keys(fieldValues).map(key => (
					<div key={key} className={styles.field}>
						<TextArea
							value={fieldValues[key as keyof IRoom] as string}
							onChange={handleChange(key as keyof IRoom)}
							onBlur={() => handleSave(key as keyof IRoom)}
						/>
					</div>
				))}
			</div>
			<Upload
				listType='picture-card'
				fileList={fileList}
				onPreview={handlePreview}
				onChange={handleChangeFile}
				onRemove={handleRemove}
				beforeUpload={async file => {
					const uploadUrl = await getUploadUrl(room.ID, 'UF_CRM_1719568104');
					const renamedFile = renameFile(
						file,
						`${room.ID}-UF_CRM_1719568046${file.name}`
					);
					await uploadFile(uploadUrl, renamedFile);
					return false; // Prevent the default upload behavior since we handle it manually
				}}
			>
				{fileList.length >= 8 ? null : uploadButton}
			</Upload>
			<Image
				src={previewImage}
				style={{ display: previewOpen ? 'block' : 'none' }}
				onClick={() => setPreviewOpen(false)}
			/>
		</div>
	);
};
