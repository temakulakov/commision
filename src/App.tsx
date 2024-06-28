import { useQuery } from '@tanstack/react-query';
import React from 'react';
import styles from './App.module.scss';
import { Comment } from './components/Comment/Comment';
import { FileArea } from './components/FileArea/FileArea';
import { Level } from './components/Level/Level';
import { Room } from './components/Room/Room';
import { User } from './components/User/User';
import { fetchCurrentRoom, fetchRooms, fetchUserFields } from './services/BX24';

const StagesID = [
	'',
	'C15:NEW',
	'C15:PREPARATION',
	'C15:PREPAYMENT_INVOIC',
	'C15:EXECUTING',
];

function App() {
	const [description, setDescription] = React.useState<string>('');

	const [level, setLevel] = React.useState<number>(0);

	const {
		data: userFields,
		isLoading: isLoadingUserFields,
		error: errorUserFields,
	} = useQuery({ queryKey: ['userFields'], queryFn: fetchUserFields });

	const {
		data: rooms,
		isLoading: isLoadingRooms,
		error: errorRooms,
	} = useQuery({
		queryKey: ['rooms', StagesID[level]],
		queryFn: () => fetchRooms(StagesID[level]),
	});

	const {
		data: room,
		isLoading: isLoadingRoom,
		error: errorRoom,
	} = useQuery({
		queryKey: ['room'],
		queryFn: () => fetchCurrentRoom(description, StagesID[level]),
	});

	const handleChangeLevel = (id: number) => {
		setLevel(id);
	};

	return (
		<div className={styles.root}>
			<User />
			<Level level={level} handleChange={handleChangeLevel} />
			<Room />
			<Comment />
			<FileArea />
		</div>
	);
}

export default App;
