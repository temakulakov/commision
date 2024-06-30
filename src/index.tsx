import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './App.less';
import { Report } from './components/Report/Report';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<ConfigProvider
				theme={{
					token: {
						// Seed Token
						colorPrimary: '#9D2135',
						borderRadius: 5,

						// Alias Token
						// colorBgContainer: '#f6ffed',
					},
					components: {
						Collapse: {
							headerPadding: '5px',
							contentPadding: '0 20px',
						},
						Checkbox: {},
					},
				}}
			>
				<QueryClientProvider client={queryClient}>
					<Routes>
						<Route path='/:userId' element={<App />} />
						<Route path='/' element={<Report />} />
					</Routes>
				</QueryClientProvider>
			</ConfigProvider>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
