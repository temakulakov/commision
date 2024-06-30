import { Select } from 'antd';
import { Room } from '../../types';
import styles from './Rooms.module.scss';

interface Props {
	setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
	rooms: Room[];
}

export const Rooms = ({ rooms, setRoom }: Props) => {
	const handleSelectRoom = (value: string) => {
		const selected = rooms?.find(room => room.TITLE === value);
		setRoom(selected);
	};

	return (
		<div className={styles.root}>
			{rooms && rooms.length > 0 && (
				<Select
					showSearch
					style={{ width: '100%' }}
					placeholder='Select a room'
					onChange={handleSelectRoom}
				>
					{rooms.map(room => (
						<Select.Option key={room.ID} value={room.TITLE}>
							{room.TITLE}
						</Select.Option>
					))}
				</Select>
			)}
		</div>
	);
};
