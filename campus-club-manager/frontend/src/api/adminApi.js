import api from './axios.js';

export const getPendingClubs = async () => {
  const res = await api.get('/admin/clubs/pending');
  return res.data;
};

export const approveClub = async (id) => {
  const res = await api.put(`/admin/clubs/${id}/approve`);
  return res.data;
};

export const rejectClub = async (id) => {
  const res = await api.put(`/admin/clubs/${id}/reject`);
  return res.data;
};

export const getAllAdminClubs = async () => {
  const res = await api.get('/admin/clubs/all');
  return res.data;
};

export const assignAdmin = async (clubId, adminId) => {
  const res = await api.put(`/admin/clubs/${clubId}/assign-admin`, { admin_id: adminId });
  return res.data;
};

export const getStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data;
};
