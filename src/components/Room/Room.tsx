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
	getAllFiles();
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
			const response = await axios.post(
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

	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	// Загружаем файлы при монтировании компонента
	useEffect(() => {
		const loadFiles = async () => {
			try {
				const files = await getAllFiles();
				setFileList(
					files
						.filter(item => item.NAME.split('-')[0] === String(room.ID))
						.map(file => ({
							uid: file.ID,
							name: file.NAME,
							status: 'done',
							url: file.DOWNLOAD_URL,
						}))
				);
			} catch (error) {
				message.error('Error loading files');
			}
		};

		loadFiles();
	}, []);

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
			message.success(`File -${file.name} removed successfully`);
		} catch (error) {
			message.error('Failed to remove file');
		}
	};

	const handleChangeFile: UploadProps['onChange'] = ({
		fileList: newFileList,
	}) => setFileList(newFileList);

	return (
		<div className={styles.root}>
			<h2>Комната номер: {room.TITLE}</h2>
			{user === 1462 && (
				<>
					<p>
						Журавлева В.Л. - помещений фондохранилищ, фондового оборудования и
						витрин
					</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568046 || ''}
						onChange={handleChange('UF_CRM_1719568046')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568046')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568046'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568046'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568046--${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
				</>
			)}
			{user === 1725 && (
				<>
					<p>Нестеров А.А. - систем пожарной и охранной сигнализации</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568072 || ''}
						onChange={handleChange('UF_CRM_1719568072')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568072')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568072'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568072'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568072-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Нестеров А.А. - системы охранного телевидения</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568104 || ''}
						onChange={handleChange('UF_CRM_1719568104')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568104')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568104'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568104'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568104-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Нестеров А.А. - системы оповещения и управления эвакуацией</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568127 || ''}
						onChange={handleChange('UF_CRM_1719568127')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568127')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568127'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568127'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568127-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Нестеров А.А. - системы контроля и управления доступом</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568145 || ''}
						onChange={handleChange('UF_CRM_1719568145')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568145')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568145'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568145'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568145-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>
						Нестеров А.А. - системы пожаротушения и противодымной вентиляции
					</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568179 || ''}
						onChange={handleChange('UF_CRM_1719568179')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568179')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568179'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568179'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568179-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Нестеров А.А. - системы видеонаблюдения</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568198 || ''}
						onChange={handleChange('UF_CRM_1719568198')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568198')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568198'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568198'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568198-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Нестеров А.А. - автоматизация</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568213 || ''}
						onChange={handleChange('UF_CRM_1719568213')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568213')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568213'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568213'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568213-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
				</>
			)}
			{user === 1873 && (
				<>
					<p>Суслова О.А. - общеобменная вентиляция</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568232 || ''}
						onChange={handleChange('UF_CRM_1719568232')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568232')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568232'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568232'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568232-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Суслова О.А. - аварийная вентиляция</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568249 || ''}
						onChange={handleChange('UF_CRM_1719568249')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568249')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568249'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568249'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568249-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
				</>
			)}
			{user === 1741 && (
				<>
					<p>Косырев И.Ю. - электрооборудование</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568266 || ''}
						onChange={handleChange('UF_CRM_1719568266')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568266')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568266'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568266'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568266-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Косырев И.Ю. - электроустановки</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568282 || ''}
						onChange={handleChange('UF_CRM_1719568282')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568282')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568282'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568282'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568282-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Косырев И.Ю. - электроосвещение</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568304 || ''}
						onChange={handleChange('UF_CRM_1719568304')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568304')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568304'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568304'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568304-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
				</>
			)}
			{user === 1669 && (
				<>
					<p>Головко В.М. - ИТП</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568360 || ''}
						onChange={handleChange('UF_CRM_1719568360')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568360')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568360'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568360'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568360--${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Головко В.М. - система холодоснабжения</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568377 || ''}
						onChange={handleChange('UF_CRM_1719568377')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568377')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568377'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568377'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568377-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Головко В.М. - холодильные машины</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568387 || ''}
						onChange={handleChange('UF_CRM_1719568387')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568387')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568387'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568387'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568387-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Головко В.М. - система кондиционирования</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568405 || ''}
						onChange={handleChange('UF_CRM_1719568405')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568405')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568405'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568405'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568405-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Головко В.М. - системы водоснабжения и канализации</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568439 || ''}
						onChange={handleChange('UF_CRM_1719568439')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568439')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568439'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568439'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568439-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Головко В.М. - система отопления</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568490 || ''}
						onChange={handleChange('UF_CRM_1719568490')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568490')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568490'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568490'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568490-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
				</>
			)}
			{user === 1460 && (
				<>
					<p>Плаксун В.В. - системы диспетчеризации</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568508 || ''}
						onChange={handleChange('UF_CRM_1719568508')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568508')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568508'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568508'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568508-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
					<p>Плаксун В.В. - структурированные кабельные системы</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568528 || ''}
						onChange={handleChange('UF_CRM_1719568528')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568528')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568528'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568528'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568528-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
				</>
			)}
			{user === 2047 && (
				<>
					<p>Яковлева Н.Н. - конструктив и архитектура</p>
					<TextArea
						style={{ marginBottom: '10px' }}
						value={fieldValues.UF_CRM_1719568686 || ''}
						onChange={handleChange('UF_CRM_1719568686')}
						autoSize={{ minRows: 3, maxRows: 5 }}
						onBlur={() => handleSave('UF_CRM_1719568686')}
					/>
					<Upload
						listType='picture-card'
						fileList={fileList.filter(
							item => item.name.split('-')[1] === 'UF_CRM_1719568686'
						)}
						onPreview={handlePreview}
						onChange={handleChangeFile}
						onRemove={handleRemove}
						beforeUpload={async file => {
							const uploadUrl = await getUploadUrl(
								room.ID,
								'UF_CRM_1719568104'
							);
							const renamedFile = renameFile(
								file,
								`${room.ID}-UF_CRM_1719568686-${file.name}`
							);
							await uploadFile(uploadUrl, renamedFile);
							return false; // Prevent the default upload behavior since we handle it manually
						}}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: visible => setPreviewOpen(visible),
								afterOpenChange: visible => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}
				</>
			)}
			<div style={{ marginTop: '10px' }}></div>
		</div>
	);
};

export default Room;
