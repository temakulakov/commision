import React, { useEffect } from 'react';

const AuthWindow: React.FC<{ onAuthSuccess: () => void }> = ({
	onAuthSuccess,
}) => {
	useEffect(() => {
		const authWindow = window.open(
			'https://intranet.gctm.ru:8891',
			'authWindow',
			'width=600,height=400'
		);

		const handleMessage = (event: MessageEvent) => {
			if (event.origin !== 'http://intranet.gctm.ru') return; // Проверяем, что сообщение пришло с правильного домена

			if (event.data === 'authenticated') {
				localStorage.setItem('isAuthenticated', 'true');
				onAuthSuccess();
				authWindow?.close();
			}
		};

		window.addEventListener('message', handleMessage);

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, [onAuthSuccess]);

	return null;
};

export default AuthWindow;
