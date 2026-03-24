import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { PlusCircle, Calendar, MapPin, Users, FileText, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { createEvent } from '../../api/eventApi.js';
import { getClubs } from '../../api/clubApi.js';
import { eventSchema } from '../../utils/validators.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clubId, setClubId] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: { capacity: 100 },
  });

  useEffect(() => {
    getClubs().then(res => {
      const club = (res.data || []).find(c => c.admin_id === user?.id);
      if (club) setClubId(club.id);
    });
  }, [user?.id]);

  const onSubmit = async (data) => {
    if (!clubId) return toast.error('No club found');
    try {
      await createEvent(clubId, data);
      toast.success('Event created!');
      navigate('/club-admin/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6 max-w-2xl">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Create Event</h1>
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}>
            <PlusCircle className="w-5 h-5 text-accent" />
          </motion.div>
        </div>
        <p className="text-text-secondary">Schedule a new event for your club.</p>
      </motion.div>

      <motion.form variants={item} onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
        <div>
          <label htmlFor="title" className="label">Event Title *</label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input id="title" {...register('title')} className="input pl-10" placeholder="Hackathon 2026" />
          </div>
          {errors.title && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.title.message}</motion.p>}
        </div>

        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea id="description" {...register('description')} rows={3} className="input resize-none" placeholder="What is this event about?" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event_date" className="label">Start Date & Time *</label>
            <input id="event_date" type="datetime-local" {...register('event_date')} className="input" />
            {errors.event_date && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.event_date.message}</motion.p>}
          </div>
          <div>
            <label htmlFor="end_date" className="label">End Date & Time</label>
            <input id="end_date" type="datetime-local" {...register('end_date')} className="input" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="label">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input id="location" {...register('location')} className="input pl-10" placeholder="Building / Room" />
            </div>
          </div>
          <div>
            <label htmlFor="capacity" className="label">Capacity</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input id="capacity" type="number" {...register('capacity', { valueAsNumber: true })} className="input pl-10" placeholder="100" />
            </div>
            {errors.capacity && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.capacity.message}</motion.p>}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
          <PlusCircle className="w-4 h-4" />
          {isSubmitting ? 'Creating...' : 'Create Event'}
          {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
