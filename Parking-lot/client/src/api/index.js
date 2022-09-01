import axios from 'axios';

const BASE_URL = "http://localhost:5000";

export const bookSlot = (formData) => axios.post(`${BASE_URL}/slots/book`, formData);

export const getSlots = () => axios.get(`${BASE_URL}/slots/fetch`);

export const chargeUser = (userId, price, exitTime) => axios.put(`${BASE_URL}/slots/charge/${userId}`, { price, exitTime });

export const existUser = (userId) => axios.get(`${BASE_URL}/slots/check/${userId}`);

export const continuePay = (userId, formData) => axios.put(`${BASE_URL}/slots/continue/${userId}`, formData);
