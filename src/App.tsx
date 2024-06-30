import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { useParams } from 'react-router-dom';
import styles from './App.module.scss';
import { Comment } from './components/Comment/Comment';
import { FileArea } from './components/FileArea/FileArea';
import { Level } from './components/Level/Level';
import { Room } from './components/Room/Room';
import { Rooms } from './components/Rooms/Rooms';
import { User } from './components/User/User';
import { fetchCurrentRoom, fetchRooms, fetchUserFields } from './services/BX24';
import { Room as IRoom, IUserField } from './types'; // Импортируйте интерфейс IUserField

const StagesID = [
	'',
	'C15:NEW',
	'C15:PREPARATION',
	'C15:PREPAYMENT_INVOIC',
	'C15:EXECUTING',
];

function App() {
	const { userId } = useParams<{ userId: string }>();
	const userIdNumber = Number(userId);
	console.log(userIdNumber);
	const [user, setUser] = useState<number>(0);
	const [description, setDescription] = useState<string>('');
	const [level, setLevel] = useState<number>(0);
	const [selectedRoom, setSelectedRoom] = useState<IRoom | undefined>(
		undefined
	);

	const {
		data: userFields,
		isLoading: isLoadingUserFields,
		error: errorUserFields,
	} = useQuery<IUserField[]>({
		queryKey: ['userFields'],
		queryFn: fetchUserFields,
	});

	console.log(userFields);

	const {
		data: rooms,
		isLoading: isLoadingRooms,
		error: errorRooms,
	} = useQuery<IRoom[]>({
		queryKey: ['rooms', StagesID[level]],
		queryFn: () => fetchRooms(StagesID[level]),
	});

	const {
		data: room,
		isLoading: isLoadingRoom,
		error: errorRoom,
	} = useQuery<IRoom>({
		queryKey: ['room'],
		queryFn: () => fetchCurrentRoom(description, StagesID[level]),
	});

	const handleChangeLevel = (id: number) => {
		setLevel(id);
	};

	return (
		<div className={styles.root}>
			<User />
			<h1>Замечания по приемке</h1>
			{userIdNumber === 1669 && <h3>Головко Владимир Михайлович</h3>}
			{userIdNumber === 1462 && <h3>Журавлева Виктория Львовна</h3>}
			{userIdNumber === 1873 && <h3>Суслова Ольга Алексеевна</h3>}
			{userIdNumber === 1741 && <h3>Косырев Игорь Юрьевич</h3>}
			{userIdNumber === 1460 && <h3>Плаксун Василий Васильевич</h3>}
			{userIdNumber === 1460 && <h3>Яковлева Наталья Николаевна</h3>}
			<Level level={level} handleChange={handleChangeLevel} />
			<AnimatePresence>
				{rooms && <Rooms rooms={rooms} setRoom={setSelectedRoom} />}
			</AnimatePresence>
			<AnimatePresence>
				{selectedRoom && userFields && (
					<motion.div
						key={selectedRoom.ID}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						<Room
							room={selectedRoom}
							userFields={userFields}
							user={userIdNumber}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				<Comment />
			</AnimatePresence>

			<FileArea />
		</div>
	);
}

export default App;
