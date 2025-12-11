import Appointment from '../models/Appointment.js';
import { getIO } from '../utils/socket.js';
import Patient from '../models/Patient.js';

export const createAppointment = async (req, res, next) => {
  try {
    const payload = req.body;
    if (!payload.patient || !payload.scheduledAt) return res.status(400).json({message:'patient and scheduledAt required'});
    const a = await Appointment.create(payload);
    try { getIO().to(String(a.doctor)).emit('appointmentCreated', a); } catch(e){}
    res.json(a);
  } catch (err) { next(err); }
};

export const getAppointment = async (req, res, next) => {
  try {
    const a = await Appointment.findById(req.params.id).populate('patient doctor hospital');
    if (!a) return res.status(404).json({message:'Not found'});
    res.json(a);
  } catch (err) { next(err); }
};

export const listAppointments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.hospital) filter.hospital = req.query.hospital;
    if (req.query.doctor) filter.doctor = req.query.doctor;
    const items = await Appointment.find(filter).populate('patient doctor hospital').limit(1000);
    res.json(items);
  } catch (err) { next(err); }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const a = await Appointment.findByIdAndUpdate(req.params.id, req.body, {new:true});
    if (!a) return res.status(404).json({message:'Not found'});
    try { getIO().to(String(a.patient)).emit('appointmentUpdated', a); } catch(e){}
    res.json(a);
  } catch (err) { next(err); }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const a = await Appointment.findByIdAndDelete(req.params.id);
    if (!a) return res.status(404).json({message:'Not found'});
    try { getIO().to(String(a.patient)).emit('appointmentDeleted', a); } catch(e){}
    res.json({message:'deleted'});
  } catch (err) { next(err); }
};
