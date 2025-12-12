// frontend/src/services/pharmacyApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api', // ensure this points to backend
  timeout: 20000
});

// optional: attach auth token via interceptor if you use JWT
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token') || null;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export async function listItems({ q, page = 1, limit = 25 } = {}) {
  const params = { q, page, limit };
  const { data } = await API.get('/pharmacy', { params });
  return data;
}

export async function getItem(id) {
  const { data } = await API.get(`/pharmacy/${id}`);
  return data;
}

export async function createItem(payload) {
  const { data } = await API.post('/pharmacy', payload);
  return data;
}

export async function updateItem(id, payload) {
  const { data } = await API.put(`/pharmacy/${id}`, payload);
  return data;
}

export async function deleteItem(id) {
  const { data } = await API.delete(`/pharmacy/${id}`);
  return data;
}

export async function addStock(id, payload) {
  const { data } = await API.post(`/pharmacy/${id}/add-stock`, payload);
  return data;
}

export async function dispenseStock(id, payload) {
  const { data } = await API.post(`/pharmacy/${id}/dispense`, payload);
  return data;
}

export default {
  listItems, getItem, createItem, updateItem, deleteItem, addStock, dispenseStock
};
