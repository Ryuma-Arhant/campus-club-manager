import api from './axios.js';

export const getEvents = async () => {
  const res = await api.get('/events');
  return res.data;
};

export const getClubEvents = async (clubId) => {
  const res = await api.get(`/events/club/${clubId}`);
  return res.data;
};

export const getEvent = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const createEvent = async (clubId, data) => {
  const res = await api.post(`/events/club/${clubId}`, data);
  return res.data;
};

export const updateEvent = async (id, data) => {
  const res = await api.put(`/events/${id}`, data);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
};

export const rsvpEvent = async (eventId, status = 'going') => {
  const res = await api.post(`/events/rsvp/${eventId}`, { status });
  return res.data;
};

export const cancelRsvp = async (eventId) => {
  const res = await api.delete(`/events/rsvp/${eventId}`);
  return res.data;
};
