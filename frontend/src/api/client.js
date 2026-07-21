import axios from 'axios';

const API_BASE = 'http://localhost:8080';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const PagesAPI = {
  getAll: () => client.get('/pages').then(r => r.data),
  getById: (id) => client.get(`/pages/${id}`).then(r => r.data),
  create: (page) => client.post('/pages', page).then(r => r.data),
  update: (id, page) => client.put(`/pages/${id}`, page).then(r => r.data),
  remove: (id) => client.delete(`/pages/${id}`),
};

export const SearchAPI = {
  search: (query) => client.get('/search', { params: { q: query } }).then(r => r.data),
};

export const PublishAPI = {
  publish: () => client.post('/publish').then(r => r.data),
  history: () => client.get('/publish/history').then(r => r.data),
};

export default client;
