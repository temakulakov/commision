import { Select } from 'antd';
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
	const [options, setOptions] = React.useState(levelOptions);

	const getPanelValue = (text: string) => {
		return levelOptions.filter(option =>
			option.value.toLowerCase().includes(text.toLowerCase())
		);
	};

	const onSelect = (value: string) => {
		const selectedOption = levelOptions.find(option => option.value === value);
		if (selectedOption) {
			handleChange(selectedOption.id);
		}
	};

	return (
		<div className={styles.root}>
			<Select
				showSearch
				style={{ width: 200 }}
				placeholder='input here'
				optionFilterProp='children'
				onChange={onSelect}
				onSearch={text => setOptions(getPanelValue(text))}
				filterOption={false}
			>
				{options.map(option => (
					<Select.Option key={option.id} value={option.value}>
						{option.value}
					</Select.Option>
				))}
			</Select>
		</div>
	);
};
