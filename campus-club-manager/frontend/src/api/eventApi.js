import api from './axios.js';

export const getEvents = async () => {
  const res = await api.get('/event');
  return res.data;
};

export const getClubEvents = async (clubId) => {
  const res = await api.get(`/event/club/${clubId}`);
  return res.data;
};

export const getEvent = async (id) => {
  const res = await api.get(`/event/${id}`);
  return res.data;
};

export const createEvent = async (clubId, data) => {
  const res = await api.post(`/event/club/${clubId}`, data);
  return res.data;
};

export const updateEvent = async (id, data) => {
  const res = await api.put(`/event/${id}`, data);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await api.delete(`/event/${id}`);
  return res.data;
};

export const rsvpEvent = async (eventId, status = 'going') => {
  const res = await api.post(`/event/rsvp/${eventId}`, { status });
  return res.data;
};

export const cancelRsvp = async (eventId) => {
  const res = await api.delete(`/event/rsvp/${eventId}`);
  return res.data;
};
