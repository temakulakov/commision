import { AutoComplete } from 'antd';
import React from 'react';
import styles from './Level.module.scss';

interface Props {
	level: number;
	handleChange: (id: number) => void;
}

const levelOptions = [
	{ id: 1, value: '1 этаж' },
	{ id: 2, value: '2 этаж' },
	{ id: 3, value: '3 этаж' },
	{ id: 4, value: '4 этаж' },
];

export const Level = ({ level, handleChange }: Props) => {
	const [options, setOptions] = React.useState<{ value: string }[]>([]);

	const getPanelValue = (text: string) => {
		return levelOptions
			.filter(option => option.value.toLowerCase().includes(text.toLowerCase()))
			.map(option => ({ value: option.value }));
	};

	const onSelect = (value: string) => {
		const selectedOption = levelOptions.find(option => option.value === value);
		if (selectedOption) {
			handleChange(selectedOption.id);
		}
	};

	return (
		<div className={styles.root}>
			<AutoComplete
				options={options}
				style={{ width: 200 }}
				onSelect={onSelect}
				onSearch={text => setOptions(getPanelValue(text))}
				placeholder='input here'
			/>
		</div>
	);
};
