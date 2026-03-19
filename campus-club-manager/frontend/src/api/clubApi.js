import api from './axios.js';

export const getClubs = async () => {
  const res = await api.get('/clubs');
  return res.data;
};

export const getClub = async (id) => {
  const res = await api.get(`/clubs/${id}`);
  return res.data;
};

export const createClub = async (data) => {
  const res = await api.post('/clubs', data);
  return res.data;
};

export const updateClub = async (id, data) => {
  const res = await api.put(`/clubs/${id}`, data);
  return res.data;
};

export const deleteClub = async (id) => {
  const res = await api.delete(`/clubs/${id}`);
  return res.data;
};
