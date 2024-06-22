import axios from 'axios';

export const serverInstance = axios.create({
    baseURL: 'http://77.91.84.85:5555/api/',
});

export const clientInstance = 'http://77.91.84.85:3000';

//? PROD: baseURL: 'http://77.91.84.85:5555/api/',  clientInstance = 'http://77.91.84.85';
//! DEV: baseURL: 'http://localhost:5555/api/', clientInstance = 'http://127.0.0.1:3000';
