import axios from 'axios';

export const serverInstance = axios.create({
    baseURL: 'http://localhost:5555/api/',
});

export const botReportInstance = axios.create({
    baseURL: 'http://77.221.143.237:8080/api',
    headers: { 'X-Auth-Token': 'CGRTS-BOT-SECRET-KEY-A9B3C7D1E5F6' },
});

/* export const botContactsInstance = axios.create({
    baseURL: 'http://77.221.143.237:8080/api/application/update',
}); */

export const clientInstance = 'http://77.91.84.85:5555/api/';

//? PROD: baseURL: 'http://77.91.84.85:5555/api/',  clientInstance = 'http://77.91.84.85';
//! DEV: baseURL: 'http://localhost:5555/api/', clientInstance = 'http://127.0.0.1:3000';
