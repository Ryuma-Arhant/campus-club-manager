import api from './axios.js';

export const requestJoin = async (clubId) => {
  const res = await api.post(`/members/request/${clubId}`);
  return res.data;
};

export const getMyMemberships = async () => {
  const res = await api.get('/members/my');
  return res.data;
};

export const getClubMembers = async (clubId) => {
  const res = await api.get(`/members/club/${clubId}`);
  return res.data;
};

export const getPendingMembers = async (clubId) => {
  const res = await api.get(`/members/pending/${clubId}`);
  return res.data;
};

export const approveMember = async (membershipId) => {
  const res = await api.put(`/members/approve/${membershipId}`);
  return res.data;
};

export const rejectMember = async (membershipId) => {
  const res = await api.put(`/members/reject/${membershipId}`);
  return res.data;
};

export const changeMemberRole = async (membershipId, role) => {
  const res = await api.put(`/members/role/${membershipId}`, { role });
  return res.data;
};

export const removeMember = async (membershipId) => {
  const res = await api.delete(`/members/${membershipId}`);
  return res.data;
};
